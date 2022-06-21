import React, { useState, useEffect } from "react";
import { Authentication, SaveAccessToken } from "@/domain/usecases";
import { LoginHeader, Footer, FormStatus, Input } from "@/presentation/components";
import { Validation } from "@/presentation/protocols/validation";
import FormContext from "@/presentation/contexts/form/form-context";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.scss";

type LoginProps = {
  validation: Validation,
  authentication: Authentication,
  saveAccessToken: SaveAccessToken,
};

const Login: React.FC<LoginProps> = ({ validation, authentication, saveAccessToken }: LoginProps) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
    email: "",
    password: "",
    mainError: "",
    emailError: "",
    passwordError: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return;
      }
  
      setState({ ...state, isLoading: true });
      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });

      await saveAccessToken.save(account.accessToken);
      history.replace("/");
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      });
    }
    
  };

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      passwordError: validation.validate("password", state.password),
    });
  }, [state.email, state.password]);

  return (
    <div className={styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form data-testid="login-form" className={styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite seu senha" />
          <button data-testid="submit-button" disabled={!!state.emailError || !!state.passwordError} type="submit" className={styles.submitButton}>Entrar</button>
          <Link
            to="/signup"
            data-testid="create-account-link"
            className={styles.createAccountLink}
          >
            Criar uma conta
          </Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default Login;