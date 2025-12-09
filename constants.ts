import { Product, ProductType } from './types';

export const APP_NAME = "KiddieBox.in";

export const CATEGORIES = [
  "All",
  "Early Learning (2-5)",
  "Creative Arts",
  "STEM & Coding",
  "Languages",
  "Digital Workbooks"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "c1",
    title: "Toddler Phonics Adventure",
    instructor: "Ms. Sarah",
    price: 49.99,
    discountPrice: 29.99,
    image: "https://picsum.photos/400/300?random=1",
    description: "A fun, musical journey through the alphabet for ages 2-4. Learn sounds, letters, and first words.",
    category: "Early Learning (2-5)",
    ageRange: "2-4",
    type: ProductType.COURSE,
    syllabus: ["Meet the Letter A", "Bouncing B Sounds", "Sing-along C", "Review A-C"],
    rating: 4.8,
    reviews: 124
  },
  {
    id: "c2",
    title: "Scratch Programming for Kids",
    instructor: "CodeWizard Mike",
    price: 89.99,
    discountPrice: 59.99,
    image: "https://picsum.photos/400/300?random=2",
    description: "Create your own games and animations using Scratch! Perfect for beginners aged 8-12.",
    category: "STEM & Coding",
    ageRange: "8-12",
    type: ProductType.COURSE,
    syllabus: ["Intro to Scratch", "Making a Sprite Move", "Loops and Events", "Build Your First Game"],
    rating: 4.9,
    reviews: 89
  },
  {
    id: "d1",
    title: "Dinosaur Math Workbook (PDF)",
    instructor: "KiddieMath Team",
    price: 15.00,
    discountPrice: 9.99,
    image: "https://picsum.photos/400/300?random=3",
    description: "Printable math worksheets with a dinosaur theme. Covers addition, subtraction, and shapes.",
    category: "Digital Workbooks",
    ageRange: "5-7",
    type: ProductType.DIGITAL,
    rating: 4.5,
    reviews: 45
  },
  {
    id: "c3",
    title: "Little Picasso: Drawing Basics",
    instructor: "Arty Anna",
    price: 35.00,
    image: "https://picsum.photos/400/300?random=4",
    description: "Step-by-step drawing lessons for little hands. Animals, cartoons, and nature.",
    category: "Creative Arts",
    ageRange: "4-8",
    type: ProductType.COURSE,
    syllabus: ["Shapes into Animals", "Drawing Faces", "Coloring Techniques", "My Masterpiece"],
    rating: 4.7,
    reviews: 210
  },
  {
    id: "c4",
    title: "Space Explorers: Solar System",
    instructor: "Astro Alex",
    price: 45.00,
    image: "https://picsum.photos/400/300?random=5",
    description: "Blast off into space! Learn about planets, stars, and rockets.",
    category: "STEM & Coding",
    ageRange: "6-9",
    type: ProductType.COURSE,
    syllabus: ["The Sun", "Rocky Planets", "Gas Giants", "Build a Rocket Model"],
    rating: 4.8,
    reviews: 67
  },
  {
    id: "d2",
    title: "Storytime Starter Pack (E-book)",
    instructor: "Storyteller Jane",
    price: 12.00,
    image: "https://picsum.photos/400/300?random=6",
    description: "A collection of 5 illustrated short stories for bedtime reading.",
    category: "Languages",
    ageRange: "3-6",
    type: ProductType.DIGITAL,
    rating: 4.9,
    reviews: 320
  }
];