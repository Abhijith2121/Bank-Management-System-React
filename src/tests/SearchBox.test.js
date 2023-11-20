import React from 'react';
import { render, screen, fireEvent ,waitFor} from '@testing-library/react';
import SearchBox from '../components/searchbox/SearchBox';
import '@testing-library/jest-dom';


const mockProps = {
  search: '',
  setSearch: jest.fn(),
  originalAccounts: [],  
  setAccounts: jest.fn(),
  originalUsers: [],    
  setUsers: jest.fn(),
  handleSearchApi: jest.fn(),
};

describe('SearchBox Component', () => {
 
  test('renders SearchBox component', () => {
    render(<SearchBox {...mockProps} />);

    const inputElement = screen.getByPlaceholderText(/Search.../i);
    expect(inputElement).toBeInTheDocument();

    const searchIcon = document.getElementsByClassName('search-icon')[0];
    expect(searchIcon).toBeInTheDocument();

    
    
  });

  test('handles search input and click', () => {
    render(<SearchBox {...mockProps} />);
    
    const userInput = 'example';
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: userInput } });

    expect(mockProps.setSearch).toHaveBeenCalledWith(userInput);
    const searchIcon = document.getElementsByClassName('search-icon')[0];
    fireEvent.click(searchIcon);
    
    expect(mockProps.handleSearchApi).toHaveBeenCalledWith(expect.any(String));
  });

  test('handles search input and click', () => {
    render(<SearchBox {...mockProps} />);
    
    const userInput = 'example';
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: userInput } });

    expect(mockProps.setSearch).toHaveBeenCalledWith(userInput);
    const searchIcon = document.getElementsByClassName('search-icon')[0];
    fireEvent.click(searchIcon);
    
    expect(mockProps.handleSearchApi).toHaveBeenCalledWith(expect.any(String));
  });
  test('resets accounts on empty search input', () => {
    render(<SearchBox {...mockProps} />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: '' } });

    expect(mockProps.setAccounts).not.toHaveBeenCalledWith(mockProps.originalAccounts);
    expect(mockProps.setUsers).not.toHaveBeenCalled();
  });
  test('resets accounts when originalAccounts and setAccounts are defined', async() => {
   
    const mockAccounts = ['account1', 'account2'];
    render(<SearchBox {...mockProps} originalAccounts={mockAccounts} />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: 'example' } });
  
    expect(mockProps.setSearch).toHaveBeenCalledWith('example');
    await waitFor(() => {
      expect(mockProps.setUsers).not.toHaveBeenCalled();
    });
  });
  test('handles search input and click with originalAccounts and setAccounts defined', () => {
    const mockAccounts = ['account1', 'account2'];
    render(<SearchBox {...mockProps} originalAccounts={mockAccounts} setAccounts={mockProps.setAccounts} />);
  
    const userInput = 'example';
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: userInput } });
  
    expect(mockProps.setSearch).toHaveBeenCalledWith(userInput);
    const searchIcon = document.getElementsByClassName('search-icon')[0];
    fireEvent.click(searchIcon);
  
    expect(mockProps.handleSearchApi).toHaveBeenCalledWith(expect.any(String));
   
  });
  test('handles search input and click with originalUsers and setUsers defined', () => {
    const mockUsers = ['user1', 'user2'];
    render(<SearchBox {...mockProps} originalUsers={mockUsers} setUsers={mockProps.setUsers} />);
  
    const userInput = 'example';
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: userInput } });
  
    expect(mockProps.setSearch).toHaveBeenCalledWith(userInput);
    const searchIcon = document.getElementsByClassName('search-icon')[0];
    fireEvent.click(searchIcon);
    expect(mockProps.handleSearchApi).toHaveBeenCalledWith(expect.any(String));
  
});

test('does not reset accounts or users when original data is not provided', () => {
  render(<SearchBox {...mockProps} originalAccounts={undefined} originalUsers={undefined} />);

  const inputElement = screen.getByPlaceholderText(/Search.../i);
  fireEvent.change(inputElement, { target: { value: 'example' } });

  expect(mockProps.setSearch).toHaveBeenCalledWith('example');
  expect(mockProps.setAccounts).not.toHaveBeenCalled();
  expect(mockProps.setUsers).not.toHaveBeenCalled();
});
test("handles search with originalacoounts and setaccounts",()=>{
  render(<SearchBox {...mockProps} originalAccounts={['account1', 'account2']} setAccounts={mockProps.setAccounts} />);
  const inputElement=screen.getByPlaceholderText(/Search.../i);
  fireEvent.change(inputElement,{target:{value:'example'}})
  expect(mockProps.setSearch).toHaveBeenCalledWith('example')
  expect(mockProps.setUsers).not.toHaveBeenCalled()

})
test("handles search with originalusers and setusers",()=>{
  render(<SearchBox {...mockProps} originalUsers={['user1', 'user2']} setUsers={mockProps.setUsers} />);
  const inputElement=screen.getByPlaceholderText(/Search.../i);
  fireEvent.change(inputElement,{target:{value:'example'}})
  expect(mockProps.setSearch).toHaveBeenCalledWith('example')
  expect(mockProps.setAccounts).not.toHaveBeenCalled()

})
});
