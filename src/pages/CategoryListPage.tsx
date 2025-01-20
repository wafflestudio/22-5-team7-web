import { useNavigate } from 'react-router-dom';

import { categories } from '../typings/item';
import styles from './CategoryListPage.module.css';

interface CategoryListPageProps {
  setCategory: (category: string) => void;
}

const CategoryListPage: React.FC<CategoryListPageProps> = ({ setCategory }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    setCategory(category);
    void navigate('/itempost');
  };

  return (
    <div className={styles.container}>
      <h1>카테고리 선택</h1>
      <ul className={styles.categoryList}>
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => {
              handleCategoryClick(category);
            }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryListPage;
