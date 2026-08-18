# Node.js Express: Update & Delete APIs


## Problem Statement


You are finishing the API for **LinkStash**, a small bookmarks app. Create and read already work — now you'll add the **Update** and **Delete** half of CRUD so a user can fix a typo in a bookmark and remove one they no longer want.


You will complete three route handler functions in `index.js`. Each receives `(req, res)` and must send the right response. The data lives in an **in-memory array** (already provided and seeded with two posts).


---


## Files to Edit


* `index.js`: **This is the only file you need to modify.** Create & Read are already done; complete `updatePost`, `patchPost`, and `deletePost`.


---


## Tasks


1. **`updatePost(req, res)` — PUT /posts/:id** (full replace)
   * `const id = parseInt(req.params.id, 10);`
   * Find the post. If it does not exist:
     ```javascript
     return res.status(404).json({ error: 'Post not found' });
     ```
   * Overwrite the fields (keep the same id): `post.title = req.body.title; post.content = req.body.content;`
   * Respond with the updated post: `res.json(post);` (**200**).


2. **`patchPost(req, res)` — PATCH /posts/:id** (partial update)
   * Parse the id and find the post; **return** a `404` if missing.
   * Merge only the sent fields: `Object.assign(post, req.body);`
   * Respond with the merged post: `res.json(post);` (**200**).


3. **`deletePost(req, res)` — DELETE /posts/:id**
   * `const index = posts.findIndex((p) => p.id === parseInt(req.params.id, 10));`
   * If `index === -1`, `return res.status(404).json({ error: 'Post not found' });`
   * Remove it and respond `204` with no body: `posts.splice(index, 1); res.status(204).end();`


---


## Input / Output Examples


```javascript
// PUT /posts/1   body { "title": "New", "content": "Body" }
//   -> 200  { "id": 1, "title": "New", "content": "Body" }


// PATCH /posts/1 body { "title": "Fixed" }
//   -> 200  { "id": 1, "title": "Fixed", "content": "Original content one" }


// DELETE /posts/2
//   -> 204  (empty body)


// PUT /posts/999 (missing)
//   -> 404  { "error": "Post not found" }
```


---


## Test Cases and Marks Distribution


*(10 tests × 1 mark = 10 marks)*


1. **Handlers defined:** `updatePost`, `patchPost`, `deletePost` are functions.
2. **PUT updates:** replaces fields and responds `200` with the updated post.
3. **PUT overwrites:** an omitted field is wiped (full replace).
4. **PATCH partial:** only the sent field changes; the rest stays intact.
5. **DELETE status:** responds `204`.
6. **Deleted is gone:** the post no longer appears in the store (and a lookup `404`s).
7. **PUT missing → 404:** PUT on an unknown id responds `404`.
8. **PATCH missing → 404:** PATCH on an unknown id responds `404`.
9. **DELETE missing → 404:** DELETE on an unknown id responds `404`.
10. **String id parsed:** the string `req.params.id` matches the numeric stored id.


> These map to the five LU behaviours: **PUT updates** · **PATCH partial** · **DELETE removes** · **deleted not returned** · **missing → 404**.


---


## Success Tips


* **Reuse the read guard.** Every write starts with `parseInt(req.params.id, 10)`, then `find`/`findIndex`, then a **return-early** `404`.
* **PUT replaces, PATCH merges.** PUT overwrites every field; PATCH (`Object.assign`) only touches the fields you send.
* **Update is 200, not 201.** A `201` means a *new* resource was created — update changes an existing one.
* **DELETE → 204, no body.** Use `res.status(204).end()`. Never send a JSON body with a `204`.
* **`return` the 404.** Sending a response does not stop the function — without `return` you crash with *"Cannot set headers after they are sent."*


---


## How to Test Your Solution


1. Open the terminal.
2. Run `npm test`.
3. Read the output. All tests fail initially — use the feedback to complete `index.js`.



