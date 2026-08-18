/** 
 * Update & Delete APIs over an in-memory store.
 *
 * Create & Read are ALREADY implemented below. Your job is to complete the
 * three write handlers that finish CRUD:
 *
 *   PUT    /posts/:id  -> updatePost   (full replace)
 *   PATCH  /posts/:id  -> patchPost    (partial update)
 *   DELETE /posts/:id  -> deletePost   (remove)
 *
 * Every write starts with the SAME guard you used for GET /:id:
 *   parse the id -> find (or findIndex) -> if missing, return a 404.
 * DO NOT MOVE THE STORE OUT OF THIS FILE.
 */


// ── THE STORE ── (in-memory; resets every run). DO NOT MODIFY these two lines.
let posts = [];
let nextId = 1;


// ── ALREADY IMPLEMENTED (Create & Read) — do not change ──
function createPost(req, res) {
  const { title, content } = req.body;
  const post = { id: nextId++, title, content };
  posts.push(post);
  res.status(201).json(post);
}


function getAllPosts(req, res) {
  res.json(posts);
}


function getPostById(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
}


// ── YOUR WORK (Update & Delete) ──


/**
 * Route handler: fully replace a post.   (PUT /posts/:id)
 * @param {object} req - req.params.id (STRING), req.body = { title, content }
 * @param {object} res
 */
function updatePost(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).json({error: 'Post not found'});
  }

  post.title = req.body.title;
  post.content = req.body.content;
  res.json(post);

  // TODO 1: const id = parseInt(req.params.id, 10);
  // TODO 2: find the post; if it does not exist:
  //         return res.status(404).json({ error: 'Post not found' });
  // TODO 3: overwrite the fields (keep the same id):
  //         post.title = req.body.title; post.content = req.body.content;
  // TODO 4: respond with the updated post: res.json(post);   // 200
}


/**
 * Route handler: partially update a post.   (PATCH /posts/:id)
 * @param {object} req - req.params.id (STRING), req.body = some fields
 * @param {object} res
 */
function patchPost(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((post) => post.id === id);

  if(!post) {
    return res.status(404).json ({ error:'Post not found'});
  }

  Object.assign(post, req.body);

  res.json(post);
  // TODO 5: parse the id and find the post; 404 if missing (return!).
  // TODO 6: merge ONLY the sent fields: Object.assign(post, req.body);
  // TODO 7: respond with the merged post: res.json(post);   // 200
}


/**
 * Route handler: remove a post.   (DELETE /posts/:id)
 * @param {object} req - req.params.id (STRING)
 * @param {object} res
 */
function deletePost(req, res) {
  const id = parseInt(req.params.id, 10);
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts.splice(index, 1);
  res.status(204).end();
  // TODO 8:  const id = parseInt(req.params.id, 10);
  // TODO 9:  const index = posts.findIndex((p) => p.id === id);
  //          if (index === -1) return res.status(404).json({ error: 'Post not found' });
  // TODO 10: posts.splice(index, 1);
  //          res.status(204).end();   // 204 No Content — no body
}


// Resets/seeds the store between tests. DO NOT MODIFY.
function __resetStore() {
  posts = [
    { id: 1, title: 'First post', content: 'Original content one' },
    { id: 2, title: 'Second post', content: 'Original content two' },
  ];
  nextId = 3;
}


// Exported for testing. DO NOT MODIFY.
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  patchPost,
  deletePost,
  __resetStore,
};
