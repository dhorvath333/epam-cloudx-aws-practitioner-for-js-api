'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      productName: 'Book',
      price: 12.99
    })
  };
};
