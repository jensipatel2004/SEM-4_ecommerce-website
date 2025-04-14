import ing1 from './t_shirt.jpg';
import ing2 from './t_shirt1.jpg';
import ing3 from './t_shirt3.jpg';
import ing4 from './t_shirt4.jpg';

const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description for Product 1',
    image: ing1, // Directly use the imported image variable
    category: 'category1',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description for Product 2',
    image: ing2, // Directly use the imported image variable
    category: 'category2',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description for Product 3',
    image: ing3, // Directly use the imported image variable
    category: 'category1',
  },
  {
    id: 4,
    name: 'Product 4',
    description: 'Description for Product 4',
    image: ing4, // Directly use the imported image variable
    category: 'category3',
  },
  // Add more products as needed
];

export default products;
