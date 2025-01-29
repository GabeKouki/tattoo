import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../Utils/SupabaseClient';
import { useSession } from '../../Context/SessionContext';
import { useNavigate } from 'react-router-dom';
// import { createEmployee } from '../../Utils/EmployeeUtils';
import './ManageEmployees.css';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'artist',
  });
  const dialogRef = useRef(null);
  const addDialogRef = useRef(null);
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session.user.app_metadata.role !== 'admin') {
      navigate('/dashboard');
    }
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }
    setEmployees(data);
  };

  const deleteEmployee = async (employeeId) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', employeeId)
      .single();

    if (error) {
      throw error;
    }
    fetchEmployees();
  };

  // const handleAddEmployee = async () => {
  //   const { email, password, name, phone, role } = newEmployee;

  //   const { data, error } = await createEmployee(email, password, { name, role, phone });

  //   if (error) {
  //     console.error('Failed to create employee:', error);
  //   } else {
  //     console.log('Employee created:', data);
  //     fetchEmployees();
  //     closeAddDialog();
  //   }
  // };

  const openAddDialog = () => {
    if (addDialogRef.current) {
      addDialogRef.current.showModal();
    }
  };

  const closeAddDialog = () => {
    if (addDialogRef.current) {
      addDialogRef.current.close();
    }
    setNewEmployee({ email: '', password: '', name: '', phone: '', role: 'artist' });
  };

  const handleEditEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    setEditingEmployee(employee);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setEditingEmployee(null);
  };

  const updateEmployee = async () => {
    if (!editingEmployee) return;

    const { id, name, phone, role } = editingEmployee;
    const { error } = await supabase
      .from('users')
      .update({
        name: name || editingEmployee.name,
        phone: phone || editingEmployee.phone,
        role: role || editingEmployee.role,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating employee:', error);
      return;
    }

    fetchEmployees();
    closeDialog();
  };

  return (
    <div className="ManageEmployeeContainer">
              <div className="content-container">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </button>
          </div>
      <div className="ManageUtils">
        <button className="add-button" onClick={openAddDialog}>Add Employee</button>
      </div>
      <h1 className='ManageEmployeesHeader'>Current Employees:</h1>
      <div className="Employees">
        {employees.map((artist) => (
          <div className="employee-card" key={artist.id}>
            <h3>{artist.name}</h3>
            <p><strong>Email:</strong> {artist.email}</p>
            <p><strong>Phone:</strong> {artist.phone}</p>
            <p><strong>Role:</strong> {artist.role}</p>
            <p><strong>Hired on:</strong> {new Date(artist.created_at).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}</p>
            <div className="ManageButtons">
              <button onClick={() => handleEditEmployee(artist.id)}>Edit</button>
              <button onClick={() => deleteEmployee(artist.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <dialog ref={addDialogRef} className="AddEmployeeDialog">
        <h2>Add New Employee</h2>
        <form>
          <div className="form-group">
            <label htmlFor="add-email">Email</label>
            <input
              type="email"
              id="add-email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-password">Password</label>
            <input
              type="password"
              id="add-password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-name">Name</label>
            <input
              type="text"
              id="add-name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-phone">Phone</label>
            <input
              type="tel"
              id="add-phone"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-role">Role</label>
            <select
              id="add-role"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              required
            >
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
        <div className="dialog-buttons">
          {/* <button onClick={handleAddEmployee}>Add</button> */}
          <button>Add</button>
          <button onClick={closeAddDialog}>Cancel</button>
        </div>
      </dialog>

      <dialog ref={dialogRef} className="EditEmployeeDialog">
        <h2>Edit Employee: {editingEmployee?.name || 'Unknown'}</h2>
        <form>
          <div className="form-group">
            <label htmlFor="edit-name">Name</label>
            <input
              type="text"
              id="edit-name"
              value={editingEmployee?.name || ''}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-phone">Phone</label>
            <input
              type="tel"
              id="edit-phone"
              value={editingEmployee?.phone || ''}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-role">Role</label>
            <select
              id="edit-role"
              value={editingEmployee?.role || ''}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
            >
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
        <div className="dialog-buttons">
          <button onClick={updateEmployee}>Save Changes</button>
          <button onClick={closeDialog}>Cancel</button>
        </div>
      </dialog>
    </div>
  );
};

export default ManageEmployees;
