import { CheckLoggedIn } from "components/Authentication";
import { CustomLink } from "components/CustomLink";
import { FormGroup } from "components/FormGroup";
import { Input } from "components/Input";
import { InputPassword } from "components/InputPassword";
import { Label } from "components/Label";
import { userRole, userStatus } from "constants/global";
import { PATH } from "constants/path";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import useInputChange from "hooks/useInputChange";
import { auth, db } from "libs/firebase-app";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import styles from "styles/auth.module.scss";
import classNames from "utils/classNames";

const SignUpPage = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { onChange } = useInputChange(values, setValues);
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAllInputFilled = Object.values(values).every((value) => value !== "");
    if (!isAllInputFilled) {
      toast.error("Please fill all inputs!");
      return;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Confirmation password do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      if (!auth.currentUser) return;
      await updateProfile(auth.currentUser, {
        photoURL: "https://avatars.githubusercontent.com/u/61537853?v=4",
      });
      await setDoc(doc(db, "users", auth.currentUser.uid as string), {
        uid: auth.currentUser.uid,
        photoURL: "https://avatars.githubusercontent.com/u/61537853?v=4",
        displayName: auth.currentUser.displayName || "Unknown",
        email: values.email,
        password: values.password,
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: serverTimestamp(),
        follows: [],
      });
      toast.success("Sign up successfully!");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  return (
    <CheckLoggedIn>
      <div className={styles.section}>
        <div className={styles.container}>
          <form onSubmit={handleSignUp}>
            <h1 className={styles.heading}>Welcome to Netfilm</h1>
            <span className={styles.label}>SignUp to continue</span>
            <div className={styles.main}>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" placeholder="Email" onChange={onChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputPassword name="password" placeholder="Min 8 characters" onChange={onChange} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="confirmPassword">Re-password</Label>
                <InputPassword
                  name="confirmPassword"
                  placeholder="Min 8 characters"
                  onChange={onChange}
                />
              </FormGroup>
              <button type="submit" className={classNames(styles.button, styles.buttonLarge)}>
                Sign Up
              </button>
            </div>
            <div className={styles.alreadyAccount}>
              Have an account? <CustomLink href={PATH.signIn}>Sign In Here</CustomLink>
            </div>
          </form>
        </div>
      </div>
    </CheckLoggedIn>
  );
};

export default SignUpPage;
