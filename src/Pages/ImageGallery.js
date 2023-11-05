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
    event.dataTransfer.setData('text/plain', 'dragging');
  };

  const onDragEnd = () => {
    dragImageRef.current = null;
    dragStartIndex.current = null;
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
    let updateCount = count;
    if (updatedImages[index].isChecked) {
      updateCount--;
    } else {
      updateCount++;
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

  return (
    <Fragment>
      <div>
        <Container>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div>{count} Select</div>
              <Button onClick={onImageDelete} variant="danger">
                Delete
              </Button>
            </Card.Header>
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
