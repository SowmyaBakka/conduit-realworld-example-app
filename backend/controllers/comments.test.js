const {
  allComments,
  createComment,
  deleteComment,
} = require("./comments");
const { Article, Comment, User } = require("../models");
const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");

// Mock the models and helper
jest.mock("../models");
jest.mock("../helper/helpers", () => ({
  appendFollowers: jest.fn(),
}));

const { appendFollowers } = require("../helper/helpers");

describe("Comments Controller", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      loggedUser: null,
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("allComments", () => {
    test("should return all comments for an article with author profiles", async () => {
      const mockArticle = {
        id: 1,
        slug: "test-article",
        getComments: jest.fn().mockResolvedValue([
          { id: 1, body: "Comment 1", author: { username: "user1" } },
          { id: 2, body: "Comment 2", author: { username: "user2" } },
        ]),
      };

      mockReq.params.slug = "test-article";
      mockReq.loggedUser = { id: 1, username: "testuser" };

      Article.findOne = jest.fn().mockResolvedValue(mockArticle);
      appendFollowers.mockResolvedValue();

      await allComments(mockReq, mockRes, mockNext);

      expect(Article.findOne).toHaveBeenCalledWith({
        where: { slug: "test-article" },
      });
      expect(mockArticle.getComments).toHaveBeenCalledWith({
        include: [
          { model: User, as: "author", attributes: { exclude: ["email"] } },
        ],
      });
      expect(appendFollowers).toHaveBeenCalledTimes(2);
      expect(mockRes.json).toHaveBeenCalledWith({
        comments: expect.arrayContaining([
          expect.objectContaining({ id: 1, body: "Comment 1" }),
          expect.objectContaining({ id: 2, body: "Comment 2" }),
        ]),
      });
    });

    test("should return 404 when article is not found", async () => {
      mockReq.params.slug = "non-existent";
      Article.findOne = jest.fn().mockResolvedValue(null);

      await allComments(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe("createComment", () => {
    test("should create comment when authenticated with valid body", async () => {
      const mockArticle = { id: 1, slug: "test-article" };
      const mockComment = {
        id: 1,
        body: "Great article!",
        articleId: 1,
        userId: 1,
        dataValues: { id: 1, body: "Great article!" },
      };

      mockReq.params.slug = "test-article";
      mockReq.body.comment = { body: "Great article!" };
      mockReq.loggedUser = {
        id: 1,
        username: "testuser",
        dataValues: { id: 1, username: "testuser", token: "jwt-token" },
      };

      Article.findOne = jest.fn().mockResolvedValue(mockArticle);
      Comment.create = jest.fn().mockResolvedValue(mockComment);
      appendFollowers.mockResolvedValue();

      await createComment(mockReq, mockRes, mockNext);

      expect(Article.findOne).toHaveBeenCalledWith({
        where: { slug: "test-article" },
      });
      expect(Comment.create).toHaveBeenCalledWith({
        body: "Great article!",
        articleId: 1,
        userId: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        comment: expect.objectContaining({
          body: "Great article!",
          author: expect.objectContaining({ username: "testuser" }),
        }),
      });
    });

    test("should return 401 when not authenticated", async () => {
      mockReq.params.slug = "test-article";
      mockReq.body.comment = { body: "Great article!" };
      mockReq.loggedUser = null;

      await createComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(Comment.create).not.toHaveBeenCalled();
    });

    test("should return 400 when body is empty", async () => {
      mockReq.params.slug = "test-article";
      mockReq.body.comment = { body: "" };
      mockReq.loggedUser = { id: 1, username: "testuser" };

      await createComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(FieldRequiredError));
      expect(Comment.create).not.toHaveBeenCalled();
    });

    test("should return 400 when body is missing", async () => {
      mockReq.params.slug = "test-article";
      mockReq.body.comment = {};
      mockReq.loggedUser = { id: 1, username: "testuser" };

      await createComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(FieldRequiredError));
      expect(Comment.create).not.toHaveBeenCalled();
    });

    test("should return 404 when article is not found", async () => {
      mockReq.params.slug = "non-existent";
      mockReq.body.comment = { body: "Great article!" };
      mockReq.loggedUser = { id: 1, username: "testuser" };

      Article.findOne = jest.fn().mockResolvedValue(null);

      await createComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(Comment.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteComment", () => {
    test("should delete comment when user is the author", async () => {
      const mockComment = {
        id: 1,
        body: "Test comment",
        userId: 1,
        destroy: jest.fn().mockResolvedValue(),
      };

      mockReq.params.slug = "test-article";
      mockReq.params.commentId = "1";
      mockReq.loggedUser = { id: 1, username: "testuser" };

      Comment.findByPk = jest.fn().mockResolvedValue(mockComment);

      await deleteComment(mockReq, mockRes, mockNext);

      expect(Comment.findByPk).toHaveBeenCalledWith("1");
      expect(mockComment.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: { body: ["Comment deleted successfully"] },
      });
    });

    test("should return 401 when not authenticated", async () => {
      mockReq.params.slug = "test-article";
      mockReq.params.commentId = "1";
      mockReq.loggedUser = null;

      await deleteComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(Comment.findByPk).not.toHaveBeenCalled();
    });

    test("should return 403 when user is not the author", async () => {
      const mockComment = {
        id: 1,
        body: "Test comment",
        userId: 2,
        destroy: jest.fn(),
      };

      mockReq.params.slug = "test-article";
      mockReq.params.commentId = "1";
      mockReq.loggedUser = { id: 1, username: "testuser" };

      Comment.findByPk = jest.fn().mockResolvedValue(mockComment);

      await deleteComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(mockComment.destroy).not.toHaveBeenCalled();
    });

    test("should return 404 when comment is not found", async () => {
      mockReq.params.slug = "test-article";
      mockReq.params.commentId = "999";
      mockReq.loggedUser = { id: 1, username: "testuser" };

      Comment.findByPk = jest.fn().mockResolvedValue(null);

      await deleteComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });
});
