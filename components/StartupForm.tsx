"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner"; // ✅ replaced useToast
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
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
        toast.success("Your startup pitch has been created successfully"); // ✅ sonner success
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast.error("Please check your inputs and try again"); // ✅ sonner error
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred"); // ✅ fallback error
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
          required
          placeholder="“Faith”, “Grace”, “Forgiveness”, “Hope”, “Spiritual Growth”"
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
          placeholder="A link to a peaceful nature scene, a cross, or scripture artwork"
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
              "Example: “This devotion encourages believers to lean on God’s promises when fear threatens to take hold.”",
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
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
