import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getArticle from "../../services/getArticle";
import setArticle from "../../services/setArticle";
import FormFieldset from "../FormFieldset";

const emptyForm = { title: "", description: "", body: "", tagList: "" };

/**
 * Normalize error values to an array of human-readable error lines.
 * Tolerates:
 *  - string error
 *  - array of strings
 *  - object-shaped errors (e.g. { errors: { field: [msg] } } or { field: [msg] })
 */
function toErrorLines(err) {
  if (!err) return [];
  if (typeof err === 'string') return [err];
  if (Array.isArray(err)) return err.map(String);
  
  // Handle Error objects specifically
  if (err instanceof Error) {
    return err.message ? [err.message] : ['Unexpected error occurred'];
  }

  const obj = err?.errors ?? err;
  if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return ['Unexpected error occurred'];
    
    return entries.flatMap(([k, v]) => {
      if (Array.isArray(v)) return v.map((m) => `${k} ${m}`);
      return [`${k} ${String(v)}`];
    });
  }

  return ['Unexpected error occurred'];
}

function ArticleEditorForm() {
  const { state } = useLocation();
  const [{ title, description, body, tagList }, setForm] = useState(
    state || emptyForm,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { isAuth, headers, loggedUser } = useAuth();

  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const redirect = () => navigate("/", { replace: true, state: null });
    if (!isAuth) return redirect();

    if (state || !slug) return;

    getArticle({ headers, slug })
      .then(({ author: { username }, body, description, tagList, title }) => {
        if (username !== loggedUser.username) redirect();

        setForm({ body, description, tagList, title });
      })
      .catch(console.error);

    return () => setForm(emptyForm);
  }, [headers, isAuth, loggedUser.username, navigate, slug, state]);

  const inputHandler = (e) => {
    const type = e.target.name;
    const value = e.target.value;

    setForm((form) => ({ ...form, [type]: value }));
  };

  const tagsInputHandler = (e) => {
    const value = e.target.value;

    setForm((form) => ({ ...form, tagList: value.split(/,| /) }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    // Prevent double-submit
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setErrorMessage(""); // Clear legacy error message

    try {
      const articleSlug = await setArticle({ headers, slug, body, description, tagList, title });
      navigate(`/article/${articleSlug}`);
    } catch (err) {
      setSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <fieldset>
        {/* Render error summary if submit failed */}
        {submitError && (
          <ul className="error-messages">
            {toErrorLines(submitError).map((line, idx) => (
              <li key={`${line}-${idx}`}>{line}</li>
            ))}
          </ul>
        )}
        {/* Legacy error message (kept for backward compatibility) */}
        {errorMessage && <span className="error-messages">{errorMessage}</span>}

        <FormFieldset
          placeholder="Article Title"
          name="title"
          required
          value={title}
          handler={inputHandler}
        ></FormFieldset>

        <FormFieldset
          normal
          placeholder="What's this article about?"
          name="description"
          required
          value={description}
          handler={inputHandler}
        ></FormFieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control"
            rows="8"
            placeholder="Write your article (in markdown)"
            name="body"
            required
            value={body}
            onChange={inputHandler}
          ></textarea>
        </fieldset>

        <FormFieldset
          normal
          placeholder="Enter tags"
          name="tags"
          value={tagList}
          handler={tagsInputHandler}
        >
          <div className="tag-list"></div>
        </FormFieldset>

        <button
          className="btn btn-lg pull-xs-right btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (slug ? "Updating…" : "Publishing…")
            : (slug ? "Update Article" : "Publish Article")}
        </button>
      </fieldset>
    </form>
  );
}

export default ArticleEditorForm;
