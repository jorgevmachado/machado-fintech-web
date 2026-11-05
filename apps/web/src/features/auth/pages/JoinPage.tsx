'use client';
import React ,{ useCallback ,useMemo ,useState } from 'react';
import { usePathname ,useRouter ,useSearchParams } from 'next/navigation';

import {
  Button ,
  Form ,
  type FormProps ,
  type FormValidation ,
  Lang ,
  Text ,
  useAlert ,
} from '@fintech/ui';

import { loginAction, registerAction } from '../actions';

type AuthMode = 'register' | 'login';

const FORM: Record<AuthMode ,FormProps> = {
  login: {
    fields: [
      { type: 'text' ,name: 'mode' ,value: 'login' ,hidden: true } ,
      { type: 'email' , name: 'credential', value: '' } ,
      { type: 'password' ,value: '' } ,
    ] ,
    actions: {
      submit: {
        children: 'auth.login.submit' ,
        fullWidth: true,
      } ,
      justify: 'center' ,
    } ,
    layout: undefined ,
    initialValues: {
      password: '' ,
      credential: '' ,
    },
  } ,
  register: {
    fields: [
      { type: 'text' ,name: 'mode' ,value: 'register' ,hidden: true } ,
      {
        type: 'fullname' ,
        value: '',
        name: 'name' ,
      } ,
      {
        type: 'date' ,
        value: '',
        name: 'date_of_birth' ,
        label: 'auth.form.date_birth.label' ,
        placeholder: 'auth.form.date_birth.placeholder',
      } ,
      {
        type: 'text' ,
        value: '' ,
        name: 'username' ,
        label: 'auth.form.username.label' ,
        placeholder: 'auth.form.username.placeholder',
      } ,
      { type: 'email' ,value: '' } ,
      { type: 'password' ,value: '' } ,
      { type: 'password_confirmation' ,value: '' } ,
    ] ,
    actions: {
      submit: {
        children: 'auth.register.submit' ,
        fullWidth: true,
      } ,
      justify: 'center' ,
    } ,
    layout: {
      cols: 2 ,
      fields: [
        { name: 'name' ,span: 2 } ,
        { name: 'username' ,span: 1 } ,
        { name: 'email' ,span: 1 } ,
        { name: 'date_of_birth' ,span: 2 } ,
        { name: 'password' ,span: 1 } ,
        { name: 'password_confirmation' ,span: 1 } ,
      ],
    } ,
    initialValues: {
      name: '',
      email: '' ,
      username: '' ,
      password: '' ,
      date_of_birth: '' ,
    },
  } ,
};

export default function JoinPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modeParam = searchParams.get('mode');
  const authMode: AuthMode = (!modeParam ||
    (modeParam !== 'login' && modeParam !== 'register')) ? 'login' : modeParam;

  const { showAlert } = useAlert();

  const [mode ,setMode] = useState<AuthMode>(authMode);

  const changeMode = useCallback((newMode: AuthMode) => {
    const params = new URLSearchParams(searchParams.toString());
    setMode(newMode);
    params.set('mode' ,newMode);
    router.push(`${ pathname }?${ params.toString() }`);
  },[pathname, router, searchParams]);

  const handleModeChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const newMode = mode === 'login' ? 'register' : 'login';
      changeMode(newMode);
    } ,[changeMode, mode]);

  const handleOnSuccess = useCallback(async (data: Record<string ,string>) => {
    if (mode === 'register') {
      const { status ,message } = await registerAction(data);
      showAlert({
        variant: status === 'success' ? 'success' : 'error' ,
        message: message ,
        position: 'top-right' ,
      });
      if (status === 'success') {
        changeMode('login');
      }
    }

    if (mode === 'login') {
      const { status ,message } = await loginAction(data);
      showAlert({
        variant: status === 'success' ? 'success' : 'error' ,
        message: message ,
        position: 'top-right' ,
      });
    }
  } ,[changeMode, mode, showAlert]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error' ,
      message: validation.errorMessage ?? 'auth.form.validation.error' ,
      position: 'top-right' ,
    });
  } ,[showAlert]);

  const formProps = useMemo(() => {
    return FORM[mode];
  } ,[mode]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Text weight="bold" size="2xl" color="text-gray-900" className="mb-2">
          { `auth.${ mode }.title` }
        </Text>
        <Text size="sm" color="text-gray-500" className="mb-6">
          { `auth.${ mode }.subtitle` }
        </Text>
        <Form
          fields={ formProps.fields }
          actions={ formProps.actions }
          onError={ handleOnError }
          onSuccess={ handleOnSuccess }
          className="space-y-4"
          initialValues={ formProps.initialValues }
        />
        <Text size="sm" color="text-gray-500" className="text-center">
          <Lang langKey={ `auth.${ mode }.link.title` }/>
          <Button appearance="outlineBorderless" onClick={ handleModeChange }>
            <Lang langKey={ `auth.${ mode }.link.subtitle` }/>
          </Button>
        </Text>
      </div>
    </div>
  );
}