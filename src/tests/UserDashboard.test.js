import React from "react";
import {render,screen} from '@testing-library/react'
import UserDashboard from "../components/usercomponents/userdashboard/UserDashboard";
import { MemoryRouter,Route ,Routes} from "react-router-dom";
import '@testing-library/jest-dom';
import { jwtDecode } from "jwt-decode";



jest.mock("jwt-decode");
describe('USerDashboard component',()=>{
    test('renders UserDashboard',()=>{
         
          jest.mock('jwt-decode', () => ({
            __esModule: true,
            jwtDecode: jest.fn(() => ({ username: 'mockUsername' })),
          }));
      
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
      
         expect(screen.findByText('Hi mockUsername'));
          const createAccountButton = screen.getByText('Create Account');
          expect(createAccountButton).toBeInTheDocument();
      
          const alreadyHaveAccountButton = screen.getByText('Already have a Account');
          expect(alreadyHaveAccountButton).toBeInTheDocument();
        });

        test('renders the Already Have an Account button with the correct link', () => {
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
        
          const alreadyHaveAccountButton = screen.getByText('Already have a Account');
          expect(alreadyHaveAccountButton).toBeInTheDocument();

        })
        test('renders the Dashboard title', () => {
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
        
          const dashboardTitle = screen.getByText('Dashboard');
          expect(dashboardTitle).toBeInTheDocument();
        });
        test('handles the case when there are no auth tokens', () => {
          
          localStorage.setItem('authTokens', null);
        
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
    
        });
        

        test('renders the Create Account button with the correct link', () => {
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
        
          const createAccountButton = screen.getByText('Create Account');
          expect(createAccountButton).toBeInTheDocument();
        
        });

        test('handles the case when there is no username in the decoded token', () => {
          jest.mock('jwt-decode', () => ({
            __esModule: true,
            jwtDecode: jest.fn(() => ({})),
          }));
        
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
        
          expect(screen.findByText('Hi'));
        });
       
        test('renders UserDashboard',()=>{
        
      
         
          jest.mock('jwt-decode', () => ({
            __esModule: true,
            jwtDecode: jest.fn(() => ({ username: 'mockUsername' })),
          }));
      
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
      
         expect(screen.findByText('Hi mockUsername'));
          const createAccountButton = screen.getByText('Create Account');
          expect(createAccountButton).toBeInTheDocument();
      
          const alreadyHaveAccountButton = screen.getByText('Already have a Account');
          expect(alreadyHaveAccountButton).toBeInTheDocument();
        });

        test("renders UserDashboard and decodes JWT token", () => {
          const mockAuthTokens = { access_token: "mockAccessToken" };
          localStorage.setItem("authTokens", JSON.stringify(mockAuthTokens));
      
          jwtDecode.mockReturnValue({ username: "mockUsername" });
      
          render(
            <MemoryRouter>
              <UserDashboard />
            </MemoryRouter>
          );
      
          const usernameElement = screen.getByText("Hi mockUsername");
          expect(usernameElement).toBeInTheDocument();
          expect(jwtDecode).toHaveBeenCalledWith(mockAuthTokens.access_token);
        });
        
    })