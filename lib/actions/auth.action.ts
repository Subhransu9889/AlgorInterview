'use server';

import {auth, db} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEKS = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const {uid, name, email} = params;
    try{
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists) {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email
        })
        return {
            success: true,
            message: 'Account created successfully.'
        }
    } catch (error: any) {
        console.log(error);
        if(error.code === 'auth/email-already-exist') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }
        return {
            success: false,
            message: 'Failed to create account.'
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;
    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: 'Failed to sign in.'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEKS * 1000,
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEKS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie) {
        return null;
    }

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecords = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecords.exists) {
            return null;
        }
        return {
            ...userRecords.data(),
            id: userRecords.id,
        } as User;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}