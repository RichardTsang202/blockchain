import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface SwipeContainerProps {
  children: ReactNode[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

export function SwipeContainer({ children, activeIndex, onIndexChange, className = '' }: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 计算当前页面的偏移量
  const baseTranslateX = -activeIndex * 100;

  useEffect(() => {
    if (!isDragging) {
      setTranslateX(baseTranslateX);
    }
  }, [activeIndex, baseTranslateX, isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    
    // 禁用过渡动画
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    
    setCurrentX(e.touches[0].clientX);
    const deltaX = e.touches[0].clientX - startX;
    const dragPercentage = (deltaX / window.innerWidth) * 100;
    
    // 限制拖拽范围，防止超出边界
    const newTranslateX = baseTranslateX + dragPercentage;
    const maxTranslateX = 0;
    const minTranslateX = -(children.length - 1) * 100;
    
    if (newTranslateX > maxTranslateX) {
      // 左边界阻尼效果
      const resistance = Math.max(0, 1 - (newTranslateX - maxTranslateX) / 50);
      setTranslateX(maxTranslateX + (newTranslateX - maxTranslateX) * resistance * 0.3);
    } else if (newTranslateX < minTranslateX) {
      // 右边界阻尼效果
      const resistance = Math.max(0, 1 - (minTranslateX - newTranslateX) / 50);
      setTranslateX(minTranslateX + (newTranslateX - minTranslateX) * resistance * 0.3);
    } else {
      setTranslateX(newTranslateX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || isTransitioning) return;
    
    setIsDragging(false);
    setIsTransitioning(true);
    
    const deltaX = currentX - startX;
    const threshold = window.innerWidth * 0.2; // 20% 的屏幕宽度作为切换阈值
    const velocity = Math.abs(deltaX) / 300; // 简单的速度计算
    
    let newIndex = activeIndex;
    
    // 根据滑动距离和速度决定是否切换页面
    if (Math.abs(deltaX) > threshold || velocity > 0.5) {
      if (deltaX > 0 && activeIndex > 0) {
        // 右滑，切换到上一页
        newIndex = activeIndex - 1;
      } else if (deltaX < 0 && activeIndex < children.length - 1) {
        // 左滑，切换到下一页
        newIndex = activeIndex + 1;
      }
    }
    
    // 恢复过渡动画
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    // 更新页面索引
    if (newIndex !== activeIndex) {
      onIndexChange(newIndex);
    } else {
      // 回弹到当前页面
      setTranslateX(baseTranslateX);
    }
    
    // 延迟重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning) return;
    
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isTransitioning) return;
    
    setCurrentX(e.clientX);
    const deltaX = e.clientX - startX;
    const dragPercentage = (deltaX / window.innerWidth) * 100;
    
    const newTranslateX = baseTranslateX + dragPercentage;
    const maxTranslateX = 0;
    const minTranslateX = -(children.length - 1) * 100;
    
    if (newTranslateX > maxTranslateX) {
      const resistance = Math.max(0, 1 - (newTranslateX - maxTranslateX) / 50);
      setTranslateX(maxTranslateX + (newTranslateX - maxTranslateX) * resistance * 0.3);
    } else if (newTranslateX < minTranslateX) {
      const resistance = Math.max(0, 1 - (minTranslateX - newTranslateX) / 50);
      setTranslateX(minTranslateX + (newTranslateX - minTranslateX) * resistance * 0.3);
    } else {
      setTranslateX(newTranslateX);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || isTransitioning) return;
    
    setIsDragging(false);
    setIsTransitioning(true);
    
    const deltaX = currentX - startX;
    const threshold = window.innerWidth * 0.2;
    
    let newIndex = activeIndex;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && activeIndex > 0) {
        newIndex = activeIndex - 1;
      } else if (deltaX < 0 && activeIndex < children.length - 1) {
        newIndex = activeIndex + 1;
      }
    }
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    if (newIndex !== activeIndex) {
      onIndexChange(newIndex);
    } else {
      setTranslateX(baseTranslateX);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e as any);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, currentX, startX, activeIndex, baseTranslateX]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: '100%' }}>
      <div
        ref={containerRef}
        className="flex h-full will-change-transform select-none"
        style={{
          transform: `translateX(${translateX}%)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          width: `${children.length * 100}%`,
          touchAction: 'pan-y pinch-zoom', // 允许垂直滚动但阻止水平滚动的默认行为
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* 页面指示器 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {children.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-blue-500 w-6 shadow-lg' 
                : 'bg-gray-300 w-2 hover:bg-gray-400'
            }`}
            onClick={() => onIndexChange(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      
      {/* 滑动提示 */}
      {isDragging && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-20">
          {currentX > startX ? '← 上一页' : '下一页 →'}
        </div>
      )}
    </div>
  );
}