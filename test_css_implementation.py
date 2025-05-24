#!/usr/bin/env python3
"""
Test script to verify the .timetable-item.selected CSS implementation
"""
import requests
import re

def test_css_implementation():
    print("🧪 Testing CSS Implementation for Selected Class Highlighting\n")
    
    try:
        # Test the dashboard HTML
        response = requests.get("http://localhost:8080/pages/dashboard.html")
        
        if response.status_code == 200:
            html_content = response.text
            
            # Test 1: Check if the selected class CSS exists
            selected_css_pattern = r'\.timetable-item\.selected\s*\{'
            if re.search(selected_css_pattern, html_content):
                print("✅ Test 1: .timetable-item.selected CSS class found")
            else:
                print("❌ Test 1: .timetable-item.selected CSS class NOT found")
                return False
            
            # Test 2: Check if background color is correct
            bg_color_pattern = r'background-color:\s*#1f3a93\s*!important'
            if re.search(bg_color_pattern, html_content):
                print("✅ Test 2: Correct background color (#1f3a93) found")
            else:
                print("❌ Test 2: Background color not found or incorrect")
                return False
            
            # Test 3: Check if border color is correct
            border_color_pattern = r'border-left-color:\s*#60a5fa\s*!important'
            if re.search(border_color_pattern, html_content):
                print("✅ Test 3: Correct border color (#60a5fa) found")
            else:
                print("❌ Test 3: Border color not found or incorrect")
                return False
            
            # Test 4: Check if text color override exists
            text_color_pattern = r'color:\s*white\s*!important'
            if re.search(text_color_pattern, html_content):
                print("✅ Test 4: Text color override (white) found")
            else:
                print("❌ Test 4: Text color override not found")
                return False
            
            # Test 5: Check if nested title styling exists
            title_color_pattern = r'\.timetable-item\.selected\s+\.timetable-title\s*\{\s*color:\s*white'
            if re.search(title_color_pattern, html_content, re.MULTILINE | re.DOTALL):
                print("✅ Test 5: Title color styling found")
            else:
                print("❌ Test 5: Title color styling not found")
                return False
            
            # Test 6: Check if nested info styling exists
            info_color_pattern = r'\.timetable-item\.selected\s+\.timetable-info\s*\{\s*color:\s*#e5e7eb'
            if re.search(info_color_pattern, html_content, re.MULTILINE | re.DOTALL):
                print("✅ Test 6: Info color styling found")
            else:
                print("❌ Test 6: Info color styling not found")
                return False
            
            # Test 7: Check CSS placement (should be after urgent class)
            urgent_to_selected_pattern = r'\.timetable-item\.urgent.*?\.timetable-item\.selected'
            if re.search(urgent_to_selected_pattern, html_content, re.DOTALL):
                print("✅ Test 7: CSS placement is correct (after urgent class)")
            else:
                print("❌ Test 7: CSS placement may be incorrect")
                return False
            
            print("\n🎉 ALL CSS TESTS PASSED!")
            print("\n📋 Implementation Summary:")
            print("✅ .timetable-item.selected class added")
            print("✅ Blue background (#1f3a93) with !important")
            print("✅ Light blue border (#60a5fa) with !important") 
            print("✅ White text with !important")
            print("✅ Nested title styling (white)")
            print("✅ Nested info styling (#e5e7eb)")
            print("✅ Proper CSS placement after urgent class")
            
            return True
            
        else:
            print(f"❌ Failed to load dashboard: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

if __name__ == "__main__":
    success = test_css_implementation()
    
    if success:
        print("\n🚀 Ready for next implementation phase!")
        print("💡 You can now add 'selected' class to timetable items for highlighting")
        print("🎯 Next: Implement JavaScript click handlers to apply this styling")
    else:
        print("\n❌ CSS implementation needs review") 
"""
Test script to verify the .timetable-item.selected CSS implementation
"""
import requests
import re

def test_css_implementation():
    print("🧪 Testing CSS Implementation for Selected Class Highlighting\n")
    
    try:
        # Test the dashboard HTML
        response = requests.get("http://localhost:8080/pages/dashboard.html")
        
        if response.status_code == 200:
            html_content = response.text
            
            # Test 1: Check if the selected class CSS exists
            selected_css_pattern = r'\.timetable-item\.selected\s*\{'
            if re.search(selected_css_pattern, html_content):
                print("✅ Test 1: .timetable-item.selected CSS class found")
            else:
                print("❌ Test 1: .timetable-item.selected CSS class NOT found")
                return False
            
            # Test 2: Check if background color is correct
            bg_color_pattern = r'background-color:\s*#1f3a93\s*!important'
            if re.search(bg_color_pattern, html_content):
                print("✅ Test 2: Correct background color (#1f3a93) found")
            else:
                print("❌ Test 2: Background color not found or incorrect")
                return False
            
            # Test 3: Check if border color is correct
            border_color_pattern = r'border-left-color:\s*#60a5fa\s*!important'
            if re.search(border_color_pattern, html_content):
                print("✅ Test 3: Correct border color (#60a5fa) found")
            else:
                print("❌ Test 3: Border color not found or incorrect")
                return False
            
            # Test 4: Check if text color override exists
            text_color_pattern = r'color:\s*white\s*!important'
            if re.search(text_color_pattern, html_content):
                print("✅ Test 4: Text color override (white) found")
            else:
                print("❌ Test 4: Text color override not found")
                return False
            
            # Test 5: Check if nested title styling exists
            title_color_pattern = r'\.timetable-item\.selected\s+\.timetable-title\s*\{\s*color:\s*white'
            if re.search(title_color_pattern, html_content, re.MULTILINE | re.DOTALL):
                print("✅ Test 5: Title color styling found")
            else:
                print("❌ Test 5: Title color styling not found")
                return False
            
            # Test 6: Check if nested info styling exists
            info_color_pattern = r'\.timetable-item\.selected\s+\.timetable-info\s*\{\s*color:\s*#e5e7eb'
            if re.search(info_color_pattern, html_content, re.MULTILINE | re.DOTALL):
                print("✅ Test 6: Info color styling found")
            else:
                print("❌ Test 6: Info color styling not found")
                return False
            
            # Test 7: Check CSS placement (should be after urgent class)
            urgent_to_selected_pattern = r'\.timetable-item\.urgent.*?\.timetable-item\.selected'
            if re.search(urgent_to_selected_pattern, html_content, re.DOTALL):
                print("✅ Test 7: CSS placement is correct (after urgent class)")
            else:
                print("❌ Test 7: CSS placement may be incorrect")
                return False
            
            print("\n🎉 ALL CSS TESTS PASSED!")
            print("\n📋 Implementation Summary:")
            print("✅ .timetable-item.selected class added")
            print("✅ Blue background (#1f3a93) with !important")
            print("✅ Light blue border (#60a5fa) with !important") 
            print("✅ White text with !important")
            print("✅ Nested title styling (white)")
            print("✅ Nested info styling (#e5e7eb)")
            print("✅ Proper CSS placement after urgent class")
            
            return True
            
        else:
            print(f"❌ Failed to load dashboard: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

if __name__ == "__main__":
    success = test_css_implementation()
    
    if success:
        print("\n🚀 Ready for next implementation phase!")
        print("💡 You can now add 'selected' class to timetable items for highlighting")
        print("🎯 Next: Implement JavaScript click handlers to apply this styling")
    else:
        print("\n❌ CSS implementation needs review") 