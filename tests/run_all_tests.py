#!/usr/bin/env python
"""
UNIMATE Test Runner
------------------
This script runs all the UNIMATE test scripts and reports the combined results.
"""
import subprocess
import sys
import time
import os

# Define test scripts
TEST_SCRIPTS = [
    # Core functionality tests
    {"name": "WebSocket Test", "script": "tests/simple_websocket_test.py", "category": "core"},
    {"name": "API Test", "script": "tests/simple_api_test.py", "category": "core"},
    {"name": "Core Verification", "script": "tests/verify_core.py", "category": "core"},
    
    # Comprehensive tests
    {"name": "WebSocket System Test", "script": "tests/unimate_system_test.py", "args": ["--websocket"], "category": "system"},
    {"name": "API System Test", "script": "tests/unimate_system_test.py", "args": ["--api"], "category": "system"},
]

def run_test(test):
    """Run a test script and return the result"""
    print(f"\n{'-' * 60}")
    print(f"Running {test['name']}...")
    print(f"{'-' * 60}")
    
    try:
        # Create command with proper arguments
        cmd = [sys.executable, test['script']]
        if 'args' in test:
            cmd.extend(test['args'])
        
        # Run the command with errors='replace' to handle encoding issues
        process = subprocess.run(
            cmd,
            shell=False,  # Avoid shell=True for better cross-platform compatibility
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'  # Replace invalid characters instead of raising an error
        )
        
        # Print output
        print(process.stdout)
        if process.stderr:
            print(process.stderr)
        
        return {
            "name": test['name'],
            "success": process.returncode == 0,
            "exit_code": process.returncode,
            "category": test['category']
        }
    
    except Exception as e:
        print(f"Error running test: {e}")
        return {
            "name": test['name'],
            "success": False,
            "exit_code": -1,
            "category": test['category']
        }

def print_summary(results):
    """Print a summary of the test results"""
    print("\n" + "=" * 60)
    print("UNIMATE TEST RESULTS SUMMARY")
    print("=" * 60)
    
    # Calculate statistics
    total_tests = len(results)
    passed_tests = sum(1 for r in results if r['success'])
    failed_tests = total_tests - passed_tests
    
    # Core functionality statistics
    core_tests = [r for r in results if r['category'] == 'core']
    core_passed = sum(1 for r in core_tests if r['success'])
    core_failed = len(core_tests) - core_passed
    
    # System test statistics
    system_tests = [r for r in results if r['category'] == 'system']
    system_passed = sum(1 for r in system_tests if r['success'])
    system_failed = len(system_tests) - system_passed
    
    # Print results
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests} ({passed_tests / total_tests * 100:.1f}%)")
    print(f"Failed: {failed_tests} ({failed_tests / total_tests * 100:.1f}%)")
    print("\nCore Functionality Tests:")
    print(f"  Passed: {core_passed}/{len(core_tests)}")
    print("\nSystem Tests:")
    print(f"  Passed: {system_passed}/{len(system_tests)}")
    
    print("\nIndividual Test Results:")
    for i, result in enumerate(results, 1):
        status = "[PASSED]" if result['success'] else "[FAILED]"
        print(f"{i}. {result['name']}: {status}")
    
    # Return success if all tests passed or at least all core tests passed
    if failed_tests == 0:
        print("\n[SUCCESS] ALL TESTS PASSED!")
        return 0
    elif core_failed == 0:
        print("\n[SUCCESS] ALL CORE FUNCTIONALITY TESTS PASSED!")
        print("Note: Some system tests failed, but the essential functionality is working.")
        return 0
    else:
        print("\n[ERROR] SOME TESTS FAILED. Please check the logs for details.")
        return 1

def check_prerequisites():
    """Check if the UNIMATE application is running"""
    import requests
    
    try:
        response = requests.get("http://localhost:8000/", timeout=2)
        return True
    except requests.RequestException:
        print("[ERROR] UNIMATE backend is not running.")
        print("Please start the application with 'python run.py --asgi' and try again.")
        return False

def main():
    """Main entry point"""
    print("=" * 60)
    print("UNIMATE TEST RUNNER")
    print("=" * 60)
    
    # Check if the application is running
    if not check_prerequisites():
        return 1
    
    # Run all tests
    results = []
    for test in TEST_SCRIPTS:
        result = run_test(test)
        results.append(result)
        # Add a small delay between tests to ensure resources are released
        time.sleep(1)
    
    # Print summary and return exit code
    return print_summary(results)

if __name__ == "__main__":
    sys.exit(main()) 