"use client"

import { signIn } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card className="w-[400px] bg-[#1a1a1a] text-white border-gray-800">
        <CardHeader className="relative text-center">
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700" onClick={() => signIn("google", { callbackUrl: "/" })}>
            Login with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
        </CardFooter>
      </Card>
    </div>
  )
}