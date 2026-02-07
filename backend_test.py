import requests
import sys
import json
from datetime import datetime

class RestaurantAPITester:
    def __init__(self, base_url="https://spicytacos-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_seed_data(self):
        """Test seeding data"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_menu(self):
        """Test getting full menu"""
        return self.run_test("Get Full Menu", "GET", "menu", 200)

    def test_get_menu_by_category(self):
        """Test getting menu by category"""
        categories = ["tacos", "curries", "fusion", "sides", "drinks"]
        for category in categories:
            success, _ = self.run_test(f"Get {category.title()} Menu", "GET", f"menu/{category}", 200)
            if not success:
                return False
        return True

    def test_create_order(self):
        """Test creating an order"""
        order_data = {
            "customer_name": "Test Customer",
            "customer_phone": "0400000000",
            "customer_email": "test@example.com",
            "order_type": "takeaway",
            "items": [
                {
                    "menu_item_id": "test-item-1",
                    "name": "Test Taco",
                    "price": 8.50,
                    "quantity": 2
                }
            ],
            "total": 17.00,
            "notes": "Test order"
        }
        success, response = self.run_test("Create Order", "POST", "orders", 201, order_data)
        if success and 'id' in response:
            # Test getting the created order
            order_id = response['id']
            return self.run_test("Get Order", "GET", f"orders/{order_id}", 200)
        return success

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        # Test valid subscription
        email_data = {"email": f"test_{datetime.now().strftime('%H%M%S')}@example.com"}
        success, _ = self.run_test("Newsletter Subscribe", "POST", "newsletter", 201, email_data)
        
        # Test duplicate subscription (should fail)
        if success:
            self.run_test("Newsletter Duplicate", "POST", "newsletter", 400, email_data)
        
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "0400000000",
            "message": "This is a test message from the API test suite."
        }
        return self.run_test("Contact Form", "POST", "contact", 201, contact_data)

    def test_get_reviews(self):
        """Test getting reviews"""
        return self.run_test("Get Reviews", "GET", "reviews", 200)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Restaurant API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Test basic connectivity
        if not self.test_root_endpoint()[0]:
            print("❌ Cannot connect to API. Stopping tests.")
            return False

        # Seed data first
        print("\n📊 Seeding test data...")
        self.test_seed_data()

        # Test all endpoints
        print("\n🍽️ Testing Menu Endpoints...")
        self.test_get_menu()
        self.test_get_menu_by_category()

        print("\n📝 Testing Order Endpoints...")
        self.test_create_order()

        print("\n📧 Testing Newsletter Endpoint...")
        self.test_newsletter_subscription()

        print("\n💬 Testing Contact Endpoint...")
        self.test_contact_form()

        print("\n⭐ Testing Reviews Endpoint...")
        self.test_get_reviews()

        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")

        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Status {test.get('actual')} != {test.get('expected')}")
                print(f"   - {test['test']}: {error_msg}")

        return self.tests_passed == self.tests_run

def main():
    tester = RestaurantAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())