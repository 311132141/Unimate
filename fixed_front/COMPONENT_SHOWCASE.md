# Component Showcase

Since we couldn't install Storybook due to disk space limitations, I've created a lightweight component development environment that serves the same purpose.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the component showcase:**
   ```
   http://localhost:3000/components
   ```

## 📱 Features

### Component Testing Environment
- **Isolated Component Testing:** Each component is showcased individually
- **Multiple Variants:** See all available props, variants, and states
- **Interactive:** All components are fully functional
- **Design System Compliant:** Uses your Figma design tokens

### Available Component Showcases

#### 🔘 Button Component
- **Variants:** Primary, Secondary, Outline, Ghost, Destructive
- **Sizes:** Small, Medium, Large, Icon, Circle
- **States:** Normal, Disabled, Loading, Full Width
- **Icons:** Left and right icon positioning

#### 📝 Input Component
- **Sizes:** Small, Medium, Large, Button Large
- **Icons:** Left and right icon support
- **States:** Normal, Error, Disabled, Full Width
- **Types:** Text, Password, Search, etc.

#### 🎫 EventCard Component
- **With/Without Images:** Both image and placeholder states
- **Categories:** Different event types and styling
- **Interactive:** Click handlers and hover effects
- **Responsive:** Proper layout and spacing

#### 🔝 Header Component
- **Default State:** Basic header layout
- **With Search:** Pre-populated search examples
- **Interactive:** Functional search and login buttons

## 🎨 Benefits over Traditional Storybook

### Advantages:
- **No Additional Dependencies:** Uses existing Next.js setup
- **Faster Development:** No extra build process
- **Integrated:** Part of your main application
- **Tailwind Integration:** Perfect integration with your design system
- **Zero Configuration:** Works out of the box

### Usage:
1. **Component Development:** Build and test components in isolation
2. **Design Reviews:** Share specific component URLs with designers
3. **Documentation:** Living documentation of your design system
4. **Testing:** Manual testing of different component states

## 🛠 Adding New Components

To add a new component to the showcase:

1. **Import the component:**
   ```tsx
   import { YourComponent } from '@/components/YourComponent';
   ```

2. **Add to components array:**
   ```tsx
   const components = [
     'Button',
     'Input',
     'EventCard', 
     'Header',
     'YourComponent', // Add here
   ];
   ```

3. **Create render function:**
   ```tsx
   const renderYourComponentShowcase = () => (
     <div className="space-y-8">
       <h2 className="text-2xl font-bold text-white mb-4">Your Component</h2>
       {/* Add your component variations here */}
     </div>
   );
   ```

4. **Add to switch statement:**
   ```tsx
   case 'YourComponent':
     return renderYourComponentShowcase();
   ```

## 🎯 Next Steps

1. **Visit the showcase:** Go to `/components` and test each component
2. **Refine components:** Use the showcase to perfect each component
3. **Add more components:** Expand the showcase as you build more components
4. **Share with team:** Use the showcase for design reviews and documentation

This setup gives you all the benefits of Storybook without the heavy dependencies! 