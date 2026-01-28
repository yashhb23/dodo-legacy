import requests
import uuid
import os

BASE_URL = "http://localhost:8000/api"
SECRET = "test_secret"
os.environ["ADMIN_SECRET"] = SECRET

def test_moderation_flow():
    image_id = "test_image_" + str(uuid.uuid4())[:8]
    
    # 1. Post a comment
    print(f"Posting comment for image {image_id}...")
    res = requests.post(f"{BASE_URL}/gallery/{image_id}/comments", json={
        "name": "Test User",
        "message": "This is a test comment."
    })
    comment = res.json()
    comment_id = comment["id"]
    print(f"Comment posted: {comment_id}")
    
    # 2. Check if visible publicly (should NOT be)
    print("Checking public visibility (should be 0)...")
    res = requests.get(f"{BASE_URL}/gallery/{image_id}/comments")
    public_comments = res.json()
    if len(public_comments) == 0:
        print("SUCCESS: Comment is not visible publicly.")
    else:
        print("FAILURE: Comment is visible publicly!")
        return

    # 3. Approve the comment
    print("Approving comment...")
    res = requests.put(f"{BASE_URL}/admin/comments/{comment_id}/approve?secret={SECRET}")
    print(res.json()["message"])

    # 4. Check if visible publicly (should BE now)
    print("Checking public visibility (should be 1)...")
    res = requests.get(f"{BASE_URL}/gallery/{image_id}/comments")
    public_comments = res.json()
    if len(public_comments) == 1 and public_comments[0]["id"] == comment_id:
        print("SUCCESS: Comment is now visible publicly.")
    else:
        print("FAILURE: Comment is still not visible!")
        return

    # 5. Test word filtering
    print("Testing word filter (should fail)...")
    res = requests.post(f"{BASE_URL}/gallery/{image_id}/comments", json={
        "name": "Spammer",
        "message": "This is a badword comment."
    })
    if res.status_code == 400:
        print("SUCCESS: Prohibited word blocked.")
    else:
        print(f"FAILURE: Prohibited word not blocked (Status: {res.status_code})")

    # 6. Delete comment
    print("Deleting comment...")
    res = requests.delete(f"{BASE_URL}/admin/comments/{comment_id}?secret={SECRET}")
    print(res.json()["message"])

if __name__ == "__main__":
    test_moderation_flow()
