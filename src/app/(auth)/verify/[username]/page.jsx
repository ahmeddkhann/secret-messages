"use client"
import {
    FormField,
    FormLabel,
    FormControl,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from "axios";
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure the correct path to the Input component
import { Loader2 } from "lucide-react"; // Assuming you're using Lucide icons
import { FormProvider } from "react-hook-form";


const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Set submitting state
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace('/sign-in');
    } catch (error) {
      console.log("Error while verifying user:", error);
      const axiosError = error instanceof AxiosError ? error : null; // Proper error handling
      let errorMessage = axiosError?.response?.data?.message || 'An unknown error occurred';
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the verification code sent to your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VerifyAccount;
