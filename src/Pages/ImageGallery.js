import React, { Fragment, useRef, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';

const ImageGallery = () => {
  const [images, setImages] = useState([
    { id: '1', src: 'images/image-1.webp', isChecked: false },
    { id: '2', src: 'images/image-2.webp', isChecked: false },
    { id: '3', src: 'images/image-3.webp', isChecked: false },
    { id: '4', src: 'images/image-4.webp', isChecked: false },
    { id: '5', src: 'images/image-5.webp', isChecked: false },
    { id: '6', src: 'images/image-6.webp', isChecked: false },
    { id: '7', src: 'images/image-7.webp', isChecked: false },
    { id: '8', src: 'images/image-8.webp', isChecked: false },
    { id: '9', src: 'images/image-9.webp', isChecked: false },
    { id: '10', src: 'images/image-10.jpeg', isChecked: false },
    { id: '11', src: 'images/image-11.jpeg', isChecked: false },
  ]);
  const [count, setCount] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragImageRef = useRef(null);
  const dragStartIndex = useRef(null);
  const [allSelect, setAllSelect] = useState(false);

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.split('/')[0] === 'image') {
        if (!images.some((e) => e.id === file.name)) {
          setImages((prevImages) => [
            ...prevImages,
            {
              id: file.name,
              src: URL.createObjectURL(file),
              isChecked: false,
            },
          ]);
        }
      }
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
    event.dataTransfer.dropEffect = 'move';
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const onDragStart = (event, index) => {
    dragStartIndex.current = index;
    dragImageRef.current = event.target;
    // Hide the original image by adding the 'hidden-image' class
    dragImageRef.current.classList.add('hidden-image');
    event.dataTransfer.setData('text/plain', 'dragging');
  };

  const onDragEnd = () => {
    dragImageRef.current = null;
    dragStartIndex.current = null;

    // Make the original image visible again by removing the 'hidden-image' class
    const originalImage = document.querySelector('.hidden-image');
    if (originalImage) {
      originalImage.classList.remove('hidden-image');
    }
  };
  const onDrop = (event, index) => {
    event.preventDefault();
    const imagesCopy = [...images];
    const dragIndex = dragStartIndex.current;
    const dragImage = imagesCopy[dragIndex];
    imagesCopy.splice(dragIndex, 1);
    imagesCopy.splice(index, 0, dragImage);
    setImages(imagesCopy);
    setDragging(false);
  };

  const onDropImage = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.split('/')[0] === 'image') {
        if (!images.some((e) => e.id === file.name)) {
          setImages((prevImages) => [
            ...prevImages,
            {
              id: file.name,
              src: URL.createObjectURL(file),
              isChecked: false,
            },
          ]);
        }
      }
    }
  };

  const onChangeCheck = (index) => {
    const updatedImages = [...images];
    let allSelectUpdated = allSelect;
    let updateCount = count;
    if (updatedImages[index].isChecked) {
      updateCount--;
    } else {
      updateCount++;
    }
    if (updateCount === updatedImages.length) {
      setAllSelect(true);
    } else {
      setAllSelect(false);
    }
    updatedImages[index].isChecked = !updatedImages[index].isChecked;
    setImages(updatedImages);
    setCount(updateCount);
  };

  const onImageDelete = () => {
    const updatedImages = images.filter((image) => !image.isChecked);
    setImages(updatedImages);
    setCount(0);
  };

  const onAllSelected = () => {
    const updatedImages = [...images];
    const updatedAllSelect = allSelect;
    console.log(
      updatedImages.filter((image) => image.isChecked).length,
      updatedImages.length
    );
    if (
      updatedImages.filter((image) => image.isChecked).length ===
        updatedImages.length &&
      updatedAllSelect
    ) {
      updatedImages.map((image, index) => {
        updatedImages[index].isChecked = false;
      });
      setCount(0);
      setAllSelect(false);
    } else {
      updatedImages.map((image, index) => {
        if (updatedImages[index].isChecked === false) {
          updatedImages[index].isChecked = true;
        }
      });
      setCount(updatedImages.length);
      setAllSelect(true);
    }
  };

  return (
    <Fragment>
      <div>
        <Container>
          <Card>
            {count ? (
              <Card.Header className="d-flex justify-content-between fw-bold">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={allSelect}
                    onChange={onAllSelected}
                    className="mx-1"
                    style={{ height: 15, width: 15 }}
                  />
                  {count > 1 ? ' ' + count + ' Files' : ' ' + count + ' File'}{' '}
                  Selected
                </div>
                <Button onClick={onImageDelete} variant="danger">
                  Delete
                </Button>
              </Card.Header>
            ) : (
              <Card.Header className="d-flex justify-content-between fw-bold py-3">
                Gallery
              </Card.Header>
            )}

            <Card.Body>
              <div className="containers">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={
                      image.isChecked
                        ? 'image-box box selected-image'
                        : 'image-box box'
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, index)}
                  >
                    <input
                      className="check"
                      checked={image.isChecked}
                      type="checkbox"
                    />
                    <div className="image-area ">
                      <img
                        src={image.src}
                        height={100}
                        onClick={() => onChangeCheck(index)}
                        className="image w-100"
                        alt={`Image ${image.id}`}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragEnd={onDragEnd}
                      />
                    </div>
                  </div>
                ))}
                <div
                  className="image-box box"
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDropImage}
                >
                  <div className="drag-area text-center" onClick={selectFiles}>
                    {isDragging ? (
                      <span>Drop Images Here</span>
                    ) : (
                      <span>
                        Drag And Drop Image <span>Browse </span>
                      </span>
                    )}
                    <input
                      name="file"
                      type="file"
                      className="file w-100"
                      multiple
                      ref={fileInputRef}
                      onChange={onFileSelect}
                      hidden
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </Fragment>
  );
};

export default ImageGallery;
