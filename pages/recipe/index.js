import React, { useState, useEffect } from 'react';
import RecipeList from '@/components/recipes/recipe-list';
import ArrowIpIcon from '@/components/icons&Buttons/arrow-up-icon';
import Sort from "../../components/recipes/sort";
import Footer from '@/components/footer/footer';
import MainNav from '@/components/layout/main-nav';

export default function AllRecipes({ data, _sort }) {
  const [sortedData, setSortedData] = useState(data);
  const [sortOrder, setSortOrder] = useState(_sort || "default");
  const [loading, setLoading] = useState(false);

  const handleSort = (order) => {
    setSortOrder(order);
  };

  useEffect(() => {
    fetchRecipes();
  }, [sortOrder]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const newData = await fetch(`/api/recipes?page=1&sort=${sortOrder}`).then((res) => res.json());
      setSortedData(newData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainNav/>
      <Sort onSort={handleSort} />
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <RecipeList data={sortedData} />
          <ArrowIpIcon />
          <Footer/>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { sort } = query;
  const sortOrder = sort || "default";

  try {
    // If sorting criteria is not selected, fetch all recipes without sorting
    const data = await getRecipes(1, sortOrder);

    return {
      props: {
        data,
        _sort: sortOrder,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data during server-side rendering:", error);

    return {
      props: {
        data: [],
        _sort: sortOrder,
      },
    };
  }
} ``