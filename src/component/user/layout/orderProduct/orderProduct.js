import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../../../config/api';

const OrderProduct = () => {
    const [availableProducts, setAvailableProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [count, setCount] = useState(0);
    const [invoice, setInvoice] = useState(generateInvoiceNumber());
    const [inputs, setInputs] = useState({
        productName: "",
        price: "",
        productQY: ""
    });

    const auth = localStorage.getItem('auth');
    const userID = localStorage.getItem('id');

    // Modify formattedDate to generate the current date dynamically
    const formattedDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    function generateInvoiceNumber() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 1000);
        return `${timestamp}${randomNum}`;
    }

    useEffect(() => {
        // Fetch available products when the component mounts
        fetchAvailableProducts();
    }, []);

    const fetchAvailableProducts = () => {
        axios.get(BASE_URL + '/products')
            .then(res => {
                setAvailableProducts(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSearch = (event) => {
        const getUserData = event.target.value;

        axios.get(BASE_URL + `/product/${getUserData}`)
            .then(res => {
                setCount(1);
                setInputs({
                    productName: res.data.productName,
                    price: res.data.sellingPrice
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleAddProduct = (event) => {
        event.preventDefault();

        const qty = parseFloat(inputs.productQY);

        const newProduct = {
            name: inputs.productName,
            price: parseFloat(inputs.price),
            qty: isNaN(qty) ? 0 : qty
        };

        // Remove the selected product from available products
        setAvailableProducts(prevAvailableProducts =>
            prevAvailableProducts.filter(product => product.productName !== newProduct.name)
        );

        setProducts(prevProducts => [...prevProducts, newProduct]);
        setTotalAmount(prevTotal => prevTotal + (isNaN(qty) ? 0 : qty) * newProduct.price);
        setCount(0);
    };

    const handleSubmitAllProducts = async () => {
        const orderData = {
            orderProducts: products.map(product => ({
                name: product.name,
                price: product.price,
                qty: product.qty,
                invoiceNumber: invoice,
                userName: auth,
                userID: parseInt(userID),
                date: formattedDate(),
            })),
        };

        console.log('Request Payload:', orderData);

        axios.post(BASE_URL + '/addOrderProduct', orderData.orderProducts)
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Your order successfully added",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                setProducts([]);
                setTotalAmount(0);
                setCount(0);
                
            })
            .catch(error => {
                console.error('Error submitting order:', error);
            });
    };


    return (
        <div>
            <div className='bg-primary p-3 mb-3 d-flex flex-row-reverse text-white mt-3 mt-lg-0'>Home / Order Product</div>

            <div className="card shadow">
                <h5 className="card-header py-4 fw-bold text-white bg-secondary">
                    <div className='admin-text fw-bold fs-3'><i className='bx bxs-message-dots'></i>Order Product</div>
                </h5>
                <div className="card-body">

                    <form role="search">
                        <div className='row mt-3'>
                            <div className="col-12">
                                <label className="form-label text-danger fw-bold">Find your best product</label>
                                <select
                                    className="form-select text-lowercase"
                                    aria-label="Default select example"
                                    name="product"
                                    onChange={(e) => handleSearch(e)}
                                >

                                    <option value="" defaultValue>
                                        Find your product
                                    </option>
                                    {availableProducts.length > 0 ? (
                                        availableProducts.map((product, index) => (
                                            <option key={index} value={product.productName}>
                                                {product.productName}
                                            </option>
                                        ))
                                    ) : (
                                        null
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>

                    {count > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mt-2 ">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Quanity</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>{inputs.productName}</td>
                                        <td>{inputs.price} .00</td>
                                        <td>
                                            <input type="number" className="form-control" name='productQY' value={inputs.productQY} onChange={(e) => setInputs({ ...inputs, productQY: e.target.value })} placeholder="quantity" required/>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td colSpan={4}><button className='btn btn-success float-end' onClick={handleAddProduct}>Add Product</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <hr className='text-danger' />

                    {products.length > 0 && (
                        <>
                            <div className='row'>
                                <div className='col-md-8'></div>
                                <div className='col-md-4'>
                                    <table className="table table-bordered text-center table-info table-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col">#Invoice</th>
                                                <th scope="col">Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>{invoice}</td>
                                                <td>{formattedDate()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr >
                                            <th scope="col">#</th>
                                            <th scope="col">Description</th>
                                            <th scope="col" className='text-center'>QTY</th>
                                            <th scope="col" className='text-center'>UNIT PRICE</th>
                                            <th scope="col" className='text-center'>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <th scope="row">{++index}</th>
                                                <td>{product.name}</td>
                                                <td className='text-center'>{product.qty}</td>
                                                <td className='text-end'>{product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td className='text-end'>{(product.qty * product.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan={2} className='text-center font-monospace fst-italic'>Thank you for your business!</td>
                                            <td colSpan={2} className='font-monospace'>Total</td>
                                            <td className='text-end'>Rs {totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className='float-end btn btn-success' onClick={handleSubmitAllProducts}>Submit All Product</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderProduct;
