const {
  getAllPosts,
  getPostById,
  updatePost,
  patchPost,
  deletePost,
  __resetStore,
} = require('../index');


// Mock helpers — build fake Express req/res objects with spies.
function mockReq(body, params) {
  return { body: body || {}, params: params || {} };
}
function mockRes() {
  const res = {};
  res.status = jasmine.createSpy('status').and.callFake(() => res);
  res.json = jasmine.createSpy('json').and.callFake(() => res);
  res.send = jasmine.createSpy('send').and.callFake(() => res);
  res.end = jasmine.createSpy('end').and.callFake(() => res);
  return res;
}


describe('Update & Delete APIs (in-memory store)', () => {
  beforeEach(() => {
    if (typeof __resetStore === 'function') __resetStore();
  });


  // Test 1: updatePost is defined
  it('defines updatePost, patchPost and deletePost as functions', () => {
    expect(typeof updatePost).toBe('function');
    expect(typeof patchPost).toBe('function');
    expect(typeof deletePost).toBe('function');
  });


  // Test 2: PUT updates a resource and responds 200
  it('PUT: replaces the resource and responds 200', () => {
    const res = mockRes();
    updatePost(mockReq({ title: 'Updated', content: 'New body' }, { id: '1' }), res);
    expect(res.status).not.toHaveBeenCalledWith(404);
    const sent = res.json.calls.mostRecent().args[0];
    expect(sent.id).toBe(1);
    expect(sent.title).toBe('Updated');
    expect(sent.content).toBe('New body');
  });


  // Test 3: PUT overwrites all fields (omitted field is wiped)
  it('PUT: overwrites every field of the resource', () => {
    const res = mockRes();
    updatePost(mockReq({ title: 'Only title' }, { id: '1' }), res);
    const sent = res.json.calls.mostRecent().args[0];
    expect(sent.title).toBe('Only title');
    expect(sent.content).toBeUndefined();
  });


  // Test 4: PATCH updates only the fields that were sent
  it('PATCH: updates only the sent fields, leaving the rest intact', () => {
    const res = mockRes();
    patchPost(mockReq({ title: 'Patched title' }, { id: '1' }), res);
    const sent = res.json.calls.mostRecent().args[0];
    expect(sent.title).toBe('Patched title');
    expect(sent.content).toBe('Original content one'); // untouched
  });


  // Test 5: DELETE responds 204
  it('DELETE: removes the resource and responds 204', () => {
    const res = mockRes();
    deletePost(mockReq({}, { id: '1' }), res);
    expect(res.status).toHaveBeenCalledWith(204);
  });


  // Test 6: deleted resources are no longer returned
  it('DELETE: the deleted resource is no longer in the store', () => {
    deletePost(mockReq({}, { id: '1' }), mockRes());
    const all = mockRes();
    getAllPosts(mockReq(), all);
    const list = all.json.calls.mostRecent().args[0];
    expect(list.some((p) => p.id === 1)).toBe(false);
    // and a direct lookup now 404s
    const one = mockRes();
    getPostById(mockReq({}, { id: '1' }), one);
    expect(one.status).toHaveBeenCalledWith(404);
  });


  // Test 7: PUT on a missing id responds 404
  it('PUT: responds 404 for an id that does not exist', () => {
    const res = mockRes();
    updatePost(mockReq({ title: 'x', content: 'y' }, { id: '999999' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });


  // Test 8: PATCH on a missing id responds 404
  it('PATCH: responds 404 for an id that does not exist', () => {
    const res = mockRes();
    patchPost(mockReq({ title: 'x' }, { id: '999999' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });


  // Test 9: DELETE on a missing id responds 404
  it('DELETE: responds 404 for an id that does not exist', () => {
    const res = mockRes();
    deletePost(mockReq({}, { id: '999999' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });


  // Test 10: id from the URL is parsed (string param matches numeric id)
  it('handles the string id from req.params (parseInt)', () => {
    const res = mockRes();
    patchPost(mockReq({ content: 'changed' }, { id: '2' }), res);
    expect(res.status).not.toHaveBeenCalledWith(404);
    const sent = res.json.calls.mostRecent().args[0];
    expect(sent.id).toBe(2);
    expect(sent.content).toBe('changed');
  });
});



