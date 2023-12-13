import React, { useState } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setImages([]);
    setCurrentPage(1);
    setHasMoreImages(true);
    fetchImages(searchQuery, 1);
  };

  const fetchImages = (searchQuery, page) => {
    setLoading(true);

    const apiKey = '40243094-9cac1343afd7c4b92bc3dbcfd';
    const perPage = 12;
    const apiUrl = `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const { hits, totalHits } = data;

        setImages((prevImages) => [...prevImages, ...hits]);
        setCurrentPage((prevPage) => prevPage + 1);
        setHasMoreImages(currentPage < Math.ceil(totalHits / perPage));
      })
      .catch((error) => console.error('Error fetching images:', error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreImages) {
      fetchImages(query, currentPage);
    }
  };

  const openModal = (largeURL) => {
    setLargeImageURL(largeURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setLargeImageURL('');
    setShowModal(false);
  };

  const shouldRenderLoadMore = images.length > 0 && hasMoreImages;

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} openModal={openModal} />
      {loading && <p>Loading...</p>}
      {shouldRenderLoadMore && !loading && <Button onLoadMore={handleLoadMore} hasMoreImages={hasMoreImages} />}
      {showModal && <Modal largeImageURL={largeImageURL} onClose={closeModal} />}
    </div>
  );
};

export default App;