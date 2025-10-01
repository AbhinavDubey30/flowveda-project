
import React, {useEffect, useState} from 'react';
import { getBills, setAuthToken, payBill } from '../services/api';

export default function Billing({token}){
  useEffect(()=>{
    setAuthToken(token);
    if(!token) return;
    fetch();
  }, [token]);

  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  async function fetch(){
    try{
      const r = await getBills();
      setBills(r);
      // Find current bill (most recent unpaid)
      const current = r.find(bill => bill.status !== 'PAID') || r[0];
      setCurrentBill(current);
    }catch(e){
      console.error(e);
    }
  }

  async function handlePay(id){
    try{
      setPaymentLoading(true);
      await payBill(id);
      setPaymentSuccess(true);
      fetch();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
      }, 3000);
    }catch(e){
      console.error(e);
    }
    setPaymentLoading(false);
  }

  function openPaymentModal(bill){
    setCurrentBill(bill);
    setShowPaymentModal(true);
  }

  function getDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getBillStatus(bill) {
    if (bill.status === 'PAID') return { text: 'Paid', class: 'success' };
    
    const daysUntilDue = getDaysUntilDue(bill.due_date);
    if (daysUntilDue === null) return { text: 'Unpaid', class: 'warning' };
    if (daysUntilDue < 0) return { text: 'Overdue', class: 'danger' };
    if (daysUntilDue <= 3) return { text: 'Due Soon', class: 'warning' };
    return { text: 'Unpaid', class: 'secondary' };
  }

  if(!token) return <div className="alert alert-info">Login to view bills</div>

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-dark-navy mb-1">Water Billing</h3>
          <p className="text-muted mb-0">Manage your water consumption and payments</p>
        </div>
        <div className="text-end">
          <div className="small text-muted">Account Balance</div>
          <div className="h5 text-success mb-0">₹0.00</div>
        </div>
      </div>

      {/* Current Bill Overview */}
      {currentBill && (
        <div className="card mb-4">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-file-invoice me-2"></i>
              Current Bill
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h3 text-primary mb-1">₹{currentBill.amount}</div>
                  <div className="text-muted small">Amount Due</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h4 text-info mb-1">{currentBill.consumption || 'N/A'}</div>
                  <div className="text-muted small">Consumption (L)</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h4 text-warning mb-1">
                    {currentBill.due_date ? new Date(currentBill.due_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-muted small">Due Date</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <span className={`badge bg-${getBillStatus(currentBill).class} fs-6`}>
                    {getBillStatus(currentBill).text}
                  </span>
                  <div className="text-muted small mt-1">Status</div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            {currentBill.status !== 'PAID' && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-success btn-lg px-5"
                  onClick={() => openPaymentModal(currentBill)}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Pay Now
                </button>
                {getDaysUntilDue(currentBill.due_date) <= 3 && getDaysUntilDue(currentBill.due_date) > 0 && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Payment due in {getDaysUntilDue(currentBill.due_date)} days
                  </div>
                )}
                {getDaysUntilDue(currentBill.due_date) < 0 && (
                  <div className="alert alert-danger mt-3 mb-0">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Payment overdue by {Math.abs(getDaysUntilDue(currentBill.due_date))} days
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-credit-card fa-3x text-primary mb-3"></i>
              <h6>Credit/Debit Card</h6>
              <p className="text-muted small">Pay securely with your card</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-mobile-alt fa-3x text-success mb-3"></i>
              <h6>UPI Payment</h6>
              <p className="text-muted small">Quick payment via UPI</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-university fa-3x text-info mb-3"></i>
              <h6>Net Banking</h6>
              <p className="text-muted small">Transfer from your bank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills History */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Billing History
          </h5>
        </div>
        <div className="card-body">
          {bills.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Bill Period</th>
                    <th>Consumption</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id}>
                      <td>
                        <div className="fw-bold">{new Date(bill.created_at).toLocaleDateString()}</div>
                        <div className="small text-muted">Bill #{bill.id}</div>
                      </td>
                      <td>
                        <div className="fw-bold">{bill.consumption || 'N/A'} L</div>
                        <div className="small text-muted">Water consumed</div>
                      </td>
                      <td>
                        <div className="fw-bold text-primary">₹{bill.amount}</div>
                      </td>
                      <td>
                        <div>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</div>
                        {bill.due_date && (
                          <div className="small text-muted">
                            {getDaysUntilDue(bill.due_date) > 0 ? 
                              `${getDaysUntilDue(bill.due_date)} days left` : 
                              getDaysUntilDue(bill.due_date) < 0 ? 
                              `${Math.abs(getDaysUntilDue(bill.due_date))} days overdue` : 
                              'Due today'
                            }
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge bg-${getBillStatus(bill).class}`}>
                          {getBillStatus(bill).text}
                        </span>
                      </td>
                      <td>
                        {bill.status !== 'PAID' ? (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => openPaymentModal(bill)}
                          >
                            <i className="fas fa-credit-card me-1"></i>
                            Pay
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success" disabled>
                            <i className="fas fa-check me-1"></i>
                            Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-file-invoice fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No bills found</h5>
              <p className="text-muted">Your billing history will appear here once you start using water.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && currentBill && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-credit-card me-2"></i>
                  Payment Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {paymentSuccess ? (
                  <div className="text-center py-4">
                    <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                    <h4 className="text-success">Payment Successful!</h4>
                    <p className="text-muted">Your payment of ₹{currentBill.amount} has been processed successfully.</p>
                  </div>
                ) : (
                  <>
                    <div className="alert alert-info">
                      <strong>Bill Amount:</strong> ₹{currentBill.amount}
                      <br />
                      <strong>Due Date:</strong> {currentBill.due_date ? new Date(currentBill.due_date).toLocaleDateString() : 'N/A'}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select 
                        className="form-control" 
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                      >
                        <option value="">Select payment method</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="upi">UPI Payment</option>
                        <option value="netbanking">Net Banking</option>
                      </select>
                    </div>

                    {paymentMethod && (
                      <div className="alert alert-success">
                        <i className="fas fa-shield-alt me-2"></i>
                        <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                      </div>
                    )}
                  </>
                )}
              </div>
              {!paymentSuccess && (
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => handlePay(currentBill.id)}
                    disabled={!paymentMethod || paymentLoading}
                  >
                    {paymentLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card me-2"></i>
                        Pay ₹{currentBill.amount}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
