import dog from '../assets/images/dog.png';
// Generate random items
export const generateRandomItems = (count: number) => {
  const items = [];
  const titles = [
    'Think Tank App',
    'Random Item 1',
    'Random Item 2',
    'Random Item 3',
    'Random Item 4',
  ];
  const captions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    'Duis aute irure dolor in reprehenderit in voluptate.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ];
  const buttonTexts = ['Read More', 'Learn More', 'Explore', 'Click Here'];

  for (let i = 0; i < count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    const randomButtonText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];

    items.push({
      title: randomTitle,
      caption: randomCaption,
      buttonText: randomButtonText,
      image: dog, // Replace with the actual image source
    });
  }

  return items;
};
