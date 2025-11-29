import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../config/api';
import { Link } from 'react-router-dom';

const CreateInvoice = () => {

    const [invoice, setInvoice] = useState([]);

    var userId = localStorage.getItem('id');

    useEffect(() => {
        getInvoiceNumber();
    }, []);

    const getInvoiceNumber = () => {
        axios.get(BASE_URL + '/distinctInvoiceNumbersByUser/' + userId)
            .then(res => {
                console.log(res.data);
                setInvoice(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div>
            <div className='bg-primary p-3 mb-3 d-flex flex-row-reverse text-white mt-3 mt-lg-0'>Home / Create Invoice</div>

            <div className="card shadow">
                <h5 className="card-header py-4 fw-bold text-white bg-secondary">
                    <div className='admin-text fw-bold fs-3'><i className='fa fa-line-chart'></i> Create Invoice</div>
                </h5>
                
                <div className="card-body">
                    <div className='col-12 col-md-6'>
                        <div className="alert alert-warning text-center text-lowercase" role="alert">
                            Download the invoice bill by clicking the <b>Create Invoice</b> button
                        </div>
                    </div>
                </div>

                <div>
                    {invoice.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {invoice.map((invoiceNumber, index) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                    <span className="invoice-number">
                                        Invoice Number <span className='text-primary'>{invoiceNumber} </span>
                                    </span>
                                    <Link to={`/auth/create-invoice/${invoiceNumber}`} className='btn btn-success'>Create Invoice</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center mt-3 text-danger">No invoices available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;
