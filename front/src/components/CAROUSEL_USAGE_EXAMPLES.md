# Carousel Components Usage Guide

## Components Created

### 1. `SousSlider` - Reusable Carousel/Slider Component
A flexible carousel component that can be used anywhere in your project with different data sources.

### 2. `CarouselNavigation` - Reusable Navigation Controls
A standardized navigation component with progress bar and arrow buttons that can be used throughout the entire project.

---

## SousSlider Component

### Basic Usage

```tsx
import SousSlider from '@/components/SousSlider';

// Define your data
const myCarouselData = [
  {
    id: 0,
    title: 'Feature Title 1',
    description: 'Feature description goes here...',
    video: '/path/to/video.mp4',
    poster: '/path/to/poster.jpg'
  },
  // ... more items
];

// Use the component
<SousSlider
  items={myCarouselData}
  isOpen={isCarouselOpen}
  onClose={() => setIsCarouselOpen(false)}
  cardWidth="320px"
  itemsPerView={3}
/>
```

### Full Props Interface

```tsx
interface SousSliderProps {
  items: SousSliderItem[];        // Required: Array of items to display
  isOpen: boolean;                 // Required: Controls visibility
  onClose: () => void;             // Required: Close handler
  cardWidth?: string;              // Optional: Width of each card (default: '320px')
  headerTitle?: string;            // Optional: Title shown in header
  language?: 'en' | 'fr';          // Optional: Language (default: 'en')
  itemsPerView?: number;           // Optional: Items visible at once (default: 3)
}
```

### Example: Using with Different Data Sources

```tsx
// Safety Features
const [isSafetyOpen, setIsSafetyOpen] = useState(false);
<SousSlider
  items={safetyFeaturesData}
  isOpen={isSafetyOpen}
  onClose={() => setIsSafetyOpen(false)}
  headerTitle={language === 'fr' ? 'Fonctionnalités de Sécurité' : 'Safety Features'}
/>

// Performance Features
const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
<SousSlider
  items={performanceFeaturesData}
  isOpen={isPerformanceOpen}
  onClose={() => setIsPerformanceOpen(false)}
  itemsPerView={2}
  cardWidth="400px"
/>
```

---

## CarouselNavigation Component

### Basic Usage

```tsx
import CarouselNavigation from '@/components/CarouselNavigation';

const [currentIndex, setCurrentIndex] = useState(0);

<CarouselNavigation
  currentIndex={currentIndex}
  totalItems={myItems.length}
  itemsPerView={3}
  onSlideChange={setCurrentIndex}
  onPrevious={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : total - 1)}
  onNext={() => setCurrentIndex(prev => prev < total - 1 ? prev + 1 : 0)}
  enableKeyboardNavigation={true}
/>
```

### Props Interface

```tsx
interface CarouselNavigationProps {
  currentIndex: number;            // Required: Current slide index
  totalItems: number;              // Required: Total number of items
  itemsPerView?: number;           // Optional: Items visible per view (default: 3)
  onSlideChange: (index: number) => void;  // Required: Handler when clicking pagination dots
  onPrevious: () => void;          // Required: Previous button handler
  onNext: () => void;              // Required: Next button handler
  enableKeyboardNavigation?: boolean; // Optional: Enable arrow key navigation (default: false)
}
```

### Example: Replacing Existing Navigation

```tsx
// Before (old navigation)
<button onClick={prevSlide}>←</button>
<div className="dots">
  {/* pagination dots */}
</div>
<button onClick={nextSlide}>→</button>

// After (using CarouselNavigation)
<CarouselNavigation
  currentIndex={currentSlide}
  totalItems={slides.length}
  onSlideChange={setCurrentSlide}
  onPrevious={handlePrev}
  onNext={handleNext}
/>
```

---

## Integration Example in Tivoli Page

The Tivoli page now uses these components like this:

```tsx
// State
const [isMagicTrayCarouselOpen, setIsMagicTrayCarouselOpen] = useState(false);

// Data
const magicTrayCarouselData = [
  { id: 0, title: '...', description: '...', video: '...', poster: '...' },
  // ...
];

// Usage in JSX
{feature.id === 1 && (
  <SousSlider
    items={magicTrayCarouselData}
    isOpen={isMagicTrayCarouselOpen}
    onClose={() => setIsMagicTrayCarouselOpen(false)}
    cardWidth="320px"
    language={language}
    itemsPerView={3}
  />
)}
```

---

## Benefits

1. **Reusability**: Use the same components anywhere with different data
2. **Consistency**: Standardized UI/UX across all carousels
3. **Maintainability**: Update once, applies everywhere
4. **Flexibility**: Configurable props for different use cases
5. **Type Safety**: Full TypeScript support

---

## Note

Both components are fully typed and support TypeScript. The navigation component can be used standalone or within SousSlider.

