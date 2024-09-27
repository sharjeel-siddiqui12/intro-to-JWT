import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  const baseUrl = window.location.href.split(":")[0] === 'https' ? '' : 'http://localhost:5001';

  useEffect(() => {
    getAllProducts();
  }, []);

  const addProduct = (e) => {
    e.preventDefault();
    
    const productData = {
      name,
      price,
      category,
      description,
    };

    if (currentProductId) {
      // Update existing product
      axios.put(`${baseUrl}/product/${currentProductId}`, productData)
        .then(response => {
          setResultMessage(response.data.message);
          clearForm();
          getAllProducts();
        })
        .catch(error => {
          setResultMessage(error.message);
        });
    } else {
      // Create new product
      axios.post(`${baseUrl}/product`, productData)
        .then(response => {
          setResultMessage(response.data.message);
          clearForm();
          getAllProducts();
        })
        .catch(error => {
          setResultMessage(error.message);
        });
    }
  };

  const getAllProducts = () => {
    axios.get(`${baseUrl}/products`)
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const editProduct = (id) => {
    axios.get(`${baseUrl}/product/${id}`)
      .then(response => {
        const product = response.data.data;
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description);
        setCurrentProductId(product._id);
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const deleteProduct = (id) => {
    axios.delete(`${baseUrl}/product/${id}`)
      .then(response => {
        setResultMessage(response.data.message);
        getAllProducts();
      })
      .catch(error => {
        setResultMessage(error.message);
      });
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setCurrentProductId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <h1 className="text-center text-indigo-600 text-4xl font-bold mb-8">CRUD APPLICATION</h1>
      <form onSubmit={addProduct} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price:</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-indigo-500 transition"
        >
          {currentProductId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div id="result" className="text-center text-green-500 mt-4">{resultMessage}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {products.map(product => (
          <div 
            key={product._id} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2"
          >
            <h1 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Description: {product.description}</p>
            <div className="mt-4">
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-red-400 transition" 
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
              <button 
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-400 transition" 
                onClick={() => editProduct(product._id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
