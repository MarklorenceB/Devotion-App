"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, XCircle } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Clear previous messages
      setSuccessMessage("");
      setErrorMessage("");
      setErrors({});

      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        setSuccessMessage("🎉 Your devotion has been successfully added!");

        // Redirect after showing success message
        setTimeout(() => {
          router.push(`/startup/${result._id}`);
        }, 2000);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        setErrorMessage("Please check your inputs and try again");
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      setErrorMessage("An unexpected error has occurred");
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="startup-form_label mb-4">
          Devotion Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input mb-4"
          required
          placeholder="Example: “Faith Over Fear”"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label mb-4">
          Devotion Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea mb-4"
          required
          placeholder="Example: A reflection on trusting God in uncertain times, inspired by Psalm 56:3"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label mb-4">
          Devotion Theme
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input mb-4"
          placeholder="“Faith”, “Grace”, “Forgiveness”, “Hope”, “Spiritual Growth”"
          required
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label mb-4">
          Devotion Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input mb-4"
          required
          placeholder="Example: https://example.com/image.jpg"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label mb-4">
          Devotion Summary or Key Message
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          className="mt-4"
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Example: In this devotion, we explore the importance of trusting God even when circumstances are uncertain. Drawing from Psalm 56:3, we learn how faith can provide peace and assurance in challenging times.",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && (
          <p className="startup-form_error mb-4">{errors.pitch}</p>
        )}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white mt-5"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Devotion"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
