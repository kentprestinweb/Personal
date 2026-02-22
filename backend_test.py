#!/usr/bin/env python3
"""
Backend API Test Suite for Kent Angelo Prestin Portfolio Website
Tests all API endpoints including public and admin routes
"""

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from frontend environment
BACKEND_URL = "https://tradie-wins.preview.emergentagent.com/api"

# Admin credentials for testing
ADMIN_USERNAME = "kentprestin"
ADMIN_PASSWORD = "portfolio2025"

class PortfolioAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.admin_token = None
        self.test_results = []

    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details and not success:
            print(f"  Details: {details}")

    def make_request(self, method: str, endpoint: str, data: Dict[Any, Any] = None, 
                    headers: Dict[str, str] = None, files: Dict[str, Any] = None) -> requests.Response:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                if files:
                    response = requests.post(url, data=data, files=files, headers=headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed for {url}: {str(e)}")
            raise

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                if "Kent Angelo Prestin" in data.get("message", ""):
                    self.log_test("API Root", True, f"Response: {data}")
                else:
                    self.log_test("API Root", False, f"Unexpected message: {data}")
            else:
                self.log_test("API Root", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("API Root", False, f"Exception: {str(e)}")

    def test_get_content(self):
        """Test GET /api/content endpoint"""
        try:
            response = self.make_request("GET", "/content")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["hero_name", "hero_title", "about_bio", "contact_email"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields and data.get("hero_name") == "Kent Angelo Prestin":
                    self.log_test("GET /content", True, f"Content loaded with {len(data)} fields")
                else:
                    self.log_test("GET /content", False, f"Missing fields: {missing_fields} or incorrect hero_name")
            else:
                self.log_test("GET /content", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /content", False, f"Exception: {str(e)}")

    def test_admin_login(self):
        """Test POST /api/admin/login"""
        try:
            login_data = {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
            response = self.make_request("POST", "/admin/login", data=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and data.get("message") == "Login successful":
                    self.admin_token = data["token"]
                    self.log_test("POST /admin/login", True, "Login successful, token received")
                else:
                    self.log_test("POST /admin/login", False, f"Invalid response format: {data}")
            else:
                self.log_test("POST /admin/login", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /admin/login", False, f"Exception: {str(e)}")

    def test_get_portfolio(self):
        """Test GET /api/portfolio endpoint"""
        try:
            response = self.make_request("GET", "/portfolio")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if portfolio items have required fields
                        first_item = data[0]
                        required_fields = ["id", "title", "description"]
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("GET /portfolio", True, f"Portfolio loaded with {len(data)} projects")
                        else:
                            self.log_test("GET /portfolio", False, f"Missing fields in portfolio items: {missing_fields}")
                    else:
                        # Empty array is acceptable for new portfolio
                        self.log_test("GET /portfolio", True, "Empty portfolio array returned")
                else:
                    self.log_test("GET /portfolio", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("GET /portfolio", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /portfolio", False, f"Exception: {str(e)}")

    def test_get_services(self):
        """Test GET /api/services endpoint"""
        try:
            response = self.make_request("GET", "/services")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if service items have required fields
                        first_item = data[0]
                        required_fields = ["id", "title", "description", "icon"]
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("GET /services", True, f"Services loaded with {len(data)} items")
                        else:
                            self.log_test("GET /services", False, f"Missing fields in service items: {missing_fields}")
                    else:
                        self.log_test("GET /services", True, "Empty services array returned")
                else:
                    self.log_test("GET /services", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("GET /services", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /services", False, f"Exception: {str(e)}")

    def test_get_skills(self):
        """Test GET /api/skills endpoint"""
        try:
            response = self.make_request("GET", "/skills")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if skill items have required fields
                        first_item = data[0]
                        required_fields = ["id", "name", "category"]
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("GET /skills", True, f"Skills loaded with {len(data)} items")
                        else:
                            self.log_test("GET /skills", False, f"Missing fields in skill items: {missing_fields}")
                    else:
                        self.log_test("GET /skills", True, "Empty skills array returned")
                else:
                    self.log_test("GET /skills", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("GET /skills", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /skills", False, f"Exception: {str(e)}")

    def test_contact_submission(self):
        """Test POST /api/contact endpoint"""
        try:
            contact_data = {
                "name": "Kent Angelo Test User",
                "email": "test@kentangelo.dev",
                "subject": "API Testing Contact Form",
                "message": "This is a test message to verify the contact form API endpoint is working correctly."
            }
            response = self.make_request("POST", "/contact", data=contact_data)
            
            if response.status_code == 200:
                data = response.json()
                # Check if response contains the submitted data
                if (data.get("name") == contact_data["name"] and 
                    data.get("email") == contact_data["email"] and
                    "id" in data and "created_at" in data):
                    self.log_test("POST /contact", True, f"Contact message submitted successfully, ID: {data['id']}")
                else:
                    self.log_test("POST /contact", False, f"Unexpected response format: {data}")
            else:
                self.log_test("POST /contact", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /contact", False, f"Exception: {str(e)}")

    def test_admin_stats(self):
        """Test GET /api/admin/stats endpoint (authenticated)"""
        if not self.admin_token:
            self.log_test("GET /admin/stats", False, "No admin token available")
            return

        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.make_request("GET", "/admin/stats", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                expected_keys = ["portfolio", "services", "testimonials", "messages", "skills"]
                missing_keys = [key for key in expected_keys if key not in data]
                
                if not missing_keys:
                    self.log_test("GET /admin/stats", True, f"Stats retrieved: {data}")
                else:
                    self.log_test("GET /admin/stats", False, f"Missing keys in stats: {missing_keys}")
            else:
                self.log_test("GET /admin/stats", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /admin/stats", False, f"Exception: {str(e)}")

    def test_admin_content_update(self):
        """Test PUT /api/admin/content endpoint (authenticated)"""
        if not self.admin_token:
            self.log_test("PUT /admin/content", False, "No admin token available")
            return

        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            # Test with a simple content update
            content_update = {
                "hero_subtitle": "API Test Updated Subtitle",
                "about_bio": "This bio was updated via API test to verify the content management system is working."
            }
            response = self.make_request("PUT", "/admin/content", data=content_update, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Content updated successfully":
                    # Verify the update by fetching content again
                    verify_response = self.make_request("GET", "/content")
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        if (verify_data.get("hero_subtitle") == content_update["hero_subtitle"] and
                            verify_data.get("about_bio") == content_update["about_bio"]):
                            self.log_test("PUT /admin/content", True, "Content updated and verified successfully")
                        else:
                            self.log_test("PUT /admin/content", False, "Content update not reflected in GET /content")
                    else:
                        self.log_test("PUT /admin/content", False, "Failed to verify content update")
                else:
                    self.log_test("PUT /admin/content", False, f"Unexpected response: {data}")
            else:
                self.log_test("PUT /admin/content", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("PUT /admin/content", False, f"Exception: {str(e)}")

    def test_admin_token_verification(self):
        """Test admin token verification endpoint"""
        if not self.admin_token:
            self.log_test("GET /admin/verify", False, "No admin token available")
            return

        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.make_request("GET", "/admin/verify", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("valid") is True and data.get("username") == ADMIN_USERNAME:
                    self.log_test("GET /admin/verify", True, f"Token verified for user: {data['username']}")
                else:
                    self.log_test("GET /admin/verify", False, f"Invalid token verification response: {data}")
            else:
                self.log_test("GET /admin/verify", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("GET /admin/verify", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Kent Angelo Prestin Portfolio API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test public endpoints first
        self.test_api_root()
        self.test_get_content()
        self.test_get_portfolio()
        self.test_get_services()
        self.test_get_skills()
        self.test_contact_submission()
        
        # Test admin authentication
        self.test_admin_login()
        
        # Test authenticated endpoints
        self.test_admin_token_verification()
        self.test_admin_stats()
        self.test_admin_content_update()
        
        # Print summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
        
        print("=" * 60)
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total > 0:
            success_rate = (passed / total) * 100
            print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return passed == total

if __name__ == "__main__":
    tester = PortfolioAPITester()
    
    print("Kent Angelo Prestin Portfolio Website API Test Suite")
    print("=" * 60)
    
    try:
        all_passed = tester.run_all_tests()
        if all_passed:
            print("\n🎉 All tests passed! Backend API is working correctly.")
            sys.exit(0)
        else:
            print("\n⚠️  Some tests failed. Check the details above.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n⛔ Tests interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {str(e)}")
        sys.exit(1)