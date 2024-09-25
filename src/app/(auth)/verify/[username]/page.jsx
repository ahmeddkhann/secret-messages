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
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams()
    const {toast} = useToast()

    const form = useForm({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data) => {
        try {
          const response =  await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })
            toast ({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.log("error while verifying user", error);
            const axiosError = AxiosError
            let errorMessage = axiosError.response?.data.message
            toast ({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
  return (
    <div  className="flex justify-center items-centre 
    min-h-screen bg-gray-100">
    <div   className="w-full max-w-md p-8 bg-white 
      rounded-lg shadow-md">
        <div className="text-center">
        <h1
            className="text-4xl font-extrabold 
          tracking-tight lg:text-5xl mb-6"
          >
            JVerify your Account
          </h1>
          <p className="mb-4">Enter theverification code sent to your email</p>
        </div>
        <div>
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
                      placeholder="enter verification code sent to your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <Button className="" type="submit" disabled= {isSubmitting}>
            {
              isSubmitting? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ) : (
                "Verify"
              )
            }
           </Button>
          
          </form>
        </FormProvider>
        </div>
     </div>  
    </div>
  )
}

export default VerifyAccount

