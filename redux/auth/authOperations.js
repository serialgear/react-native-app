import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";
import { storage } from "../../firebase/config";

export const singUp = createAsyncThunk(
  "auth/singUp",
  async (credentials, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      await updateProfile(auth.currentUser, {
        displayName: credentials.login,
        photoURL: credentials.avatar,
      });
      const user = auth.currentUser;
      return {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        token: user.accessToken,
      };
    } catch (error) {
      console.log(error);
      if (`${error}`.includes("email-already-in-use")) {
        alert("this email is already in use");
      }
      return rejectWithValue(error.message);
    }
  }
);

export const singIn = createAsyncThunk(
  "auth/SingIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        token: user.accessToken,
      };
    } catch (error) {
      console.log(error);
      if (
        `${error}`.includes("invalid-email") ||
        `${error}`.includes("wrong-password")
      ) {
        alert("email and/or password are wrong");
      }
      return rejectWithValue(error.message);
    }
  }
);

export const singOut = createAsyncThunk(
  "auth/SingOut",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const uploadPhotoToStorage = async (uri, dir) => {
  const response = await fetch(uri);
  const file = await response.blob();
  const imageId = uuid.v4();
  const storageRef = ref(storage, `${dir}/${imageId}${file._data.name}`);
  await uploadBytes(storageRef, file).then((snapshot) => {
  });
  const storageUrlPhoto = await getDownloadURL(
    ref(storage, `${dir}/${imageId}${file._data.name}`)
  );
  return storageUrlPhoto;
};

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (uri, { rejectWithValue }) => {
    const auth = getAuth();
    try {
      const avatar = await uploadPhotoToStorage(uri, "avatar");
      await updateProfile(auth.currentUser, { photoURL: avatar });
      return { avatar: auth.currentUser.photoURL };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
