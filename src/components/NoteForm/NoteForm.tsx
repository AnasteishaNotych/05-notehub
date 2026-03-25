import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Too short!")
    .max(50, "Too long!")
    .required("Required"),
  content: Yup.string().max(500, "content is too long!"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

interface NoteFormProps {
  onCancel: () => void;
}

function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = (
    values: { title: string; content: string; tag: NoteTag },
    actions: FormikHelpers<{ title: string; content: string; tag: NoteTag }>,
  ) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };
  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as NoteTag }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage component="span" name="title" className={css.error} />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              component="span"
              name="content"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage component="span" name="tag" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating" : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
