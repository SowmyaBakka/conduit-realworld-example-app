import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ArticleEditorForm from './ArticleEditorForm';
import * as AuthContext from '../../context/AuthContext';
import * as setArticleService from '../../services/setArticle';

vi.mock('../../services/setArticle');
vi.mock('../../services/getArticle', () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
    useLocation: () => ({ state: null }),
  };
});

const mockAuthContext = {
  isAuth: true,
  headers: { Authorization: 'Token mock-token' },
  loggedUser: { username: 'testuser' },
};

describe('ArticleEditorForm - Submit UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContext);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ArticleEditorForm />
      </BrowserRouter>
    );
  };

  describe('Submit loading state', () => {
    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      
      let resolveArticle;
      const articlePromise = new Promise((resolve) => {
        resolveArticle = resolve;
      });
      
      vi.spyOn(setArticleService, 'default').mockReturnValue(articlePromise);

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Publishing');
      });

      resolveArticle('test-slug');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/article/test-slug');
      });
    });

    it('should prevent double-submit', async () => {
      const user = userEvent.setup();
      
      let resolveArticle;
      const articlePromise = new Promise((resolve) => {
        resolveArticle = resolve;
      });
      
      const setArticleSpy = vi.spyOn(setArticleService, 'default').mockReturnValue(articlePromise);

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });

      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      expect(setArticleSpy).toHaveBeenCalledTimes(1);

      resolveArticle('test-slug');
    });
  });

  describe('Error handling', () => {
    it('should display error summary with string error', async () => {
      const user = userEvent.setup();
      
      vi.spyOn(setArticleService, 'default').mockRejectedValue('Something went wrong');

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorList = screen.getByRole('list');
        expect(errorList).toBeInTheDocument();
        expect(errorList).toHaveTextContent('Something went wrong');
      });

      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Publish Article');
    });

    it('should display error summary with array of errors', async () => {
      const user = userEvent.setup();
      
      vi.spyOn(setArticleService, 'default').mockRejectedValue([
        'Title cannot be blank',
        'Description is too short'
      ]);

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title cannot be blank')).toBeInTheDocument();
        expect(screen.getByText('Description is too short')).toBeInTheDocument();
      });
    });

    it('should display error summary with object-shaped errors', async () => {
      const user = userEvent.setup();
      
      vi.spyOn(setArticleService, 'default').mockRejectedValue({
        errors: {
          title: ['cannot be blank', 'is too short'],
          body: ['cannot be blank']
        }
      });

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('title cannot be blank')).toBeInTheDocument();
        expect(screen.getByText('title is too short')).toBeInTheDocument();
        expect(screen.getByText('body cannot be blank')).toBeInTheDocument();
      });
    });

    it('should clear previous errors when submitting again', async () => {
      const user = userEvent.setup();
      
      vi.spyOn(setArticleService, 'default').mockRejectedValueOnce('First error');

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      vi.spyOn(setArticleService, 'default').mockResolvedValueOnce('test-slug');

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });

    it('should handle unexpected error format gracefully', async () => {
      const user = userEvent.setup();
      
      vi.spyOn(setArticleService, 'default').mockRejectedValue(new Error('Network error'));

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Article Title');
      const descriptionInput = screen.getByPlaceholderText("What's this article about?");
      const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      await user.type(bodyInput, 'Test Body');

      const submitButton = screen.getByRole('button', { name: /publish article/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });
});
