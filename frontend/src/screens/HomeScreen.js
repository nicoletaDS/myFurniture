import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./HomeScreen.css";
import ProductsList from "../components/ProductsList";
import { listProducts } from "../slices/product/productListSlice";

function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const bestsellers = products.slice(0, 3);

  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <section className="homepage-banner">
            <p className="name">
              MY
              <br /> <span>FURNITURE</span>
            </p>
            <p className="desc">
              From aesthetic additions to practical items, <br />
              give your home the love it deserves with the very best design.
            </p>
          </section>
          <section>
            <div className="categories">
              <a href="/kitchen">
                <img src="/images/categories/kitchen.png" alt=""></img>
                Kitchen
              </a>
              <a href="/livingromm">
                <img src="/images/categories/living-room.png" alt=""></img>
                Living Room
              </a>
              <a href="/kidsromm">
                <img src="/images/categories/kids-room.png" alt=""></img>
                Kids Room
              </a>
              <a href="/diningromm">
                <img src="/images/categories/dining-room.png" alt=""></img>
                Dining Room
              </a>
              <a href="/bedroom">
                <img src="/images/categories/bedroom.png" alt=""></img>
                Bedroom
              </a>
              <a href="/bathroom">
                <img src="/images/categories/bathroom.png" alt=""></img>
                Bathroom
              </a>
              <a href="/home-office">
                <img src="/images/categories/home-office.png" alt=""></img>
                Home office
              </a>
              <a href="/decor">
                <img src="/images/categories/decor.png" alt=""></img>
                Decor
              </a>
            </div>
          </section>

          <section>
            <div className="bestseller">
              <h1 className="title">Bestseller</h1>
              <ProductsList products={bestsellers} />
            </div>
          </section>

          <section className="products all">
            <ProductsList products={products} />
          </section>
        </>
      )}
    </div>
  );
}

export default HomeScreen;
