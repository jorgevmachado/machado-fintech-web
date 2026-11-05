import { FormValidator } from '../../../../src/components/form/validator';
import { FORM_FIELD_DEFINITIONS } from '../../../../src/components/form/field';

describe('FormValidator' ,() => {
  describe('validateField' ,() => {
    it('returns valid when the field has no validation' ,() => {
      const validator = new FormValidator();
      const field = { name: 'username' ,type: 'text' as const };
      expect(validator.validateField(field ,'Jorge')).
      toEqual({ name: 'username' ,isInvalid: false });
    });
    it('returns valid when a common rule pass' ,() => {
      const requiredRule: FormValidationRule = (_field ,value) => {
        if (!value.trim()) {
          return { isInvalid: true ,errorMessage: 'This field is required.' };
        }
        return { isInvalid: false };
      };
      const validator = new FormValidator({} ,[requiredRule]);
      const field = { name: 'name' ,type: 'text' as const };
      expect(validator.validateField(field ,'Jhon Doe')).
      toEqual({
        name: 'name' ,
        isInvalid: false ,
      });
    });
    it('returns invalid when a common rule fails' ,() => {
      const requiredRule: FormValidationRule = (_field ,value) => {
        if (!value.trim()) {
          return { isInvalid: true ,errorMessage: 'This field is required.' };
        }
        return { isInvalid: false };
      };
      const validator = new FormValidator({} ,[requiredRule]);
      const field = { name: 'name' ,type: 'text' as const };
      expect(validator.validateField(field ,'')).
      toEqual({
        name: 'name' ,
        isInvalid: true ,
        errorMessage: 'This field is required.' ,
      });
    });
    it('stops validation when a common rule fails' ,() => {
      const commonRule = jest.fn(
        () => ({ isInvalid: true ,errorMessage: 'Required' }));
      const fieldRule = jest.fn(() => ({ isInvalid: false }));
      const validator = new FormValidator({ text: fieldRule } ,
        [commonRule]);
      const field = { name: 'name' ,type: 'text' as const };
      validator.validateField(field ,'');
      expect(commonRule).toHaveBeenCalledTimes(1);
      expect(fieldRule).not.toHaveBeenCalled();
    });
    it('uses a field-specific validation rule when provided' ,() => {
      const rule: FormValidationRule = jest.fn((_field ,value) => {
        if (value !== 'Jorge') {
          return { isInvalid: true ,errorMessage: 'Invalid name.' };
        }
        return { isInvalid: false };
      });
      const validator = new FormValidator({ text: rule });
      const field = { name: 'name' ,type: 'text' as const };
      expect(validator.validateField(field ,'Carlos')).
      toEqual(
        { name: 'name' ,isInvalid: true ,errorMessage: 'Invalid name.' });
      expect(rule).toHaveBeenCalledWith(field ,'Carlos' ,{});
    });
    it('uses the field-specific rule before the Value Object validator' ,() => {
      const rule = jest.fn(() => ({
        isInvalid: true ,
        errorMessage: 'Custom validation error.' ,
      }));
      const validator = new FormValidator({ email: rule });
      const field = { name: 'email' ,type: 'email' as const };
      expect(validator.validateField(field ,'invalid')).
      toEqual({
        name: 'email' ,
        isInvalid: true ,
        errorMessage: 'Custom validation error.' ,
      });
      expect(rule).toHaveBeenCalledTimes(1);
    });
    it('uses the Value Object validator from the field definition' ,() => {
      const validator = new FormValidator();
      const field = { name: 'email' ,type: 'email' as const };
      expect(validator.validateField(field ,'jorge@example.com')).
      toEqual({ name: 'email' ,isInvalid: false });
    });
    it('returns the Value Object error when validation fails' ,() => {
      const validator = new FormValidator();
      const field = { name: 'email' ,type: 'email' as const };
      expect(validator.validateField(field ,'invalid-email')).
      toEqual({
        name: 'email' ,
        isInvalid: true ,
        errorMessage: 'form.validation.email.invalid' ,
      });
    });
    it('returns valid when the Value Object accepts the value' ,() => {
      const validator = new FormValidator();
      const field = { name: 'name' ,type: 'name' as const };
      expect(validator.validateField(field ,'Jorge')).
      toEqual({ name: 'name' ,isInvalid: false });
    });
    it('passes form data to a field-specific rule' ,() => {
      const rule: FormValidationRule = jest.fn((_field ,value ,data) => {
        if (value !== data.password) {
          return { isInvalid: true ,errorMessage: 'Passwords do not match.' };
        }
        return { isInvalid: false };
      });
      const validator = new FormValidator({ password_confirmation: rule });
      const field = {
        name: 'password_confirmation' ,
        type: 'password_confirmation' as const ,
      };
      const data = { password: '123456' ,password_confirmation: '123456' };
      expect(validator.validateField(field ,'123456' ,data)).
      toEqual({ name: 'password_confirmation' ,isInvalid: false });
      expect(rule).toHaveBeenCalledWith(field ,'123456' ,data);
    });
  });
  describe('validateFields' ,() => {
    it('validates all fields' ,() => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name' ,type: 'name' as const } ,
        { name: 'email' ,type: 'email' as const }];
      const data = { name: 'Jorge' ,email: 'jorge@example.com' };
      expect(validator.validateFields(fields ,data)).
      toEqual({
        fields: {
          name: { isInvalid: false } ,
          email: { isInvalid: false } ,
        } ,isInvalid: false ,errorMessage: undefined ,
      });
    });
    it('returns invalid when one field is invalid' ,() => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name' ,type: 'name' as const } ,
        { name: 'email' ,type: 'email' as const }];
      const data = { name: 'Jorge' ,email: 'invalid-email' };
      expect(validator.validateFields(fields ,data)).
      toEqual({
        fields: {
          name: { isInvalid: false } ,
          email: {
            isInvalid: true ,
            errorMessage: 'form.validation.email.invalid' ,
          } ,
        } ,isInvalid: true ,errorMessage: 'form.validation.email.invalid' ,
      });
    });
    it('uses an empty string when a field has no value' ,() => {
      const validator = new FormValidator();
      const fields = [{ name: 'email' ,type: 'email' as const }];
      expect(validator.validateFields(fields)).
      toEqual({
        fields: {
          email: {
            isInvalid: true ,
            errorMessage: 'form.validation.email.invalid' ,
          } ,
        } ,isInvalid: true ,errorMessage: 'form.validation.email.invalid' ,
      });
    });
    it('validates password confirmation using form data' ,() => {
      const passwordConfirmationRule: FormValidationRule = (
        _field ,value ,data) => ({
        isInvalid: value !== data.password ,
        errorMessage: value !== data.password ?
          'Passwords do not match.' :
          undefined ,
      });
      const validator = new FormValidator(
        { password_confirmation: passwordConfirmationRule });
      const fields = [
        { name: 'password' ,type: 'password' as const } ,
        {
          name: 'password_confirmation' ,
          type: 'password_confirmation' as const ,
        }];
      const data = {
        password: '@SenhaForte1' ,
        password_confirmation: '654321',
      };
      expect(validator.validateFields(fields ,data)).
      toEqual({
        fields: {
          password: { isInvalid: false } ,
          password_confirmation: {
            isInvalid: true ,
            errorMessage: 'Passwords do not match.' ,
          } ,
        } ,isInvalid: true ,errorMessage: 'Passwords do not match.' ,
      });
    });
  });
  describe('isFieldValid' ,() => {
    it('returns true when the field is valid' ,() => {
      const validator = new FormValidator();
      const field = { name: 'email' ,type: 'email' as const };
      expect(validator.isFieldValid(field ,'jorge@example.com')).toBe(true);
    });
    it('returns false when the field is invalid' ,() => {
      const validator = new FormValidator();
      const field = { name: 'email' ,type: 'email' as const };
      expect(validator.isFieldValid(field ,'invalid-email')).toBe(false);
    });
    it('passes form data to the field validation' ,() => {
      const rule: FormValidationRule = jest.fn(
        (_field ,value ,data) => ({ isInvalid: value !== data.password }));
      const validator = new FormValidator({ password_confirmation: rule });
      const field = {
        name: 'password_confirmation' ,
        type: 'password_confirmation' as const ,
      };
      expect(
        validator.isFieldValid(field ,'123456' ,{ password: '123456' })).
      toBe(true);
      expect(rule).toHaveBeenCalledTimes(1);
    });
  });
  describe('isValid' ,() => {
    it('returns true when all fields are valid' ,() => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name' ,type: 'name' as const } ,
        { name: 'email' ,type: 'email' as const }];
      expect(validator.isValid(fields ,
        { name: 'Jorge' ,email: 'jorge@example.com' })).toBe(true);
    });
    it('returns false when at least one field is invalid' ,() => {
      const validator = new FormValidator();
      const fields = [
        { name: 'name' ,type: 'name' as const } ,
        { name: 'email' ,type: 'email' as const }];
      expect(validator.isValid(fields ,
        { name: 'Jorge' ,email: 'invalid-email' })).toBe(false);
    });
    it('returns false when required validation fails' ,() => {
      const requiredRule: FormValidationRule = (
        _field ,value) => ({
        isInvalid: !value.trim() ,
        errorMessage: !value.trim() ? 'This field is required.' : undefined ,
      });
      const validator = new FormValidator({} ,[requiredRule]);
      const fields = [{ name: 'name' ,type: 'name' as const }];
      expect(validator.isValid(fields ,{ name: '' })).toBe(false);
    });
    it('returns false when data is empty' ,() => {
      const validator = new FormValidator();
      expect(
        validator.isValid([{ name: 'email' ,type: 'email' as const }] ,{})).
      toBe(false);
    });
    it('returns false when data is undefined' ,() => {
      const validator = new FormValidator();
      expect(validator.isValid([{ name: 'email' ,type: 'email' as const }])).
      toBe(false);
    });
  });
  describe('validator configuration' ,() => {
    it('passes minLength from presentation to the Value Object validator' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          presentation: {
            minLength: 5 ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            minLength: 5 ,
          }) ,
        );
      });

    it('passes maxLength from presentation to the Value Object validator' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          presentation: {
            maxLength: 10 ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            maxLength: 10 ,
          }) ,
        );
      });

    it(
      'passes minLength and maxLength from presentation to the Value Object validator' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          presentation: {
            minLength: 5 ,
            maxLength: 20 ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            minLength: 5 ,
            maxLength: 20 ,
          }) ,
        );
      });

    it(
      'preserves validatorConfig when building the Value Object configuration' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          validatorConfig: {
            minLength: 3 ,
            customOption: 'custom-value' ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            minLength: 3 ,
            customOption: 'custom-value' ,
          }) ,
        );
      });

    it('allows presentation minLength to override validatorConfig minLength' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          validatorConfig: {
            minLength: 3 ,
          } ,
          presentation: {
            minLength: 10 ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            minLength: 10 ,
          }) ,
        );
      });

    it('allows presentation maxLength to override validatorConfig maxLength' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          validatorConfig: {
            maxLength: 50 ,
          } ,
          presentation: {
            maxLength: 10 ,
          } ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          expect.objectContaining({
            maxLength: 10 ,
          }) ,
        );
      });

    it(
      'does not add undefined presentation values to the validator configuration' ,
      () => {
        const tryCreate = jest.fn().mockReturnValue({
          isOk: true ,
          isFailure: false ,
          instance: {} ,
        });

        const validator = new FormValidator();

        const field: TFormField = {
          name: 'name' ,
          type: 'name' ,
          presentation: {} ,
        };

        FORM_FIELD_DEFINITIONS.name.validator = {
          tryCreate ,
        };

        validator.validateField(field ,'Jorge');

        expect(tryCreate).toHaveBeenCalledWith(
          'Jorge' ,
          {} ,
        );
      });

    it('works without presentation' ,() => {
      const tryCreate = jest.fn().mockReturnValue({
        isOk: true ,
        isFailure: false ,
        instance: {} ,
      });

      const validator = new FormValidator();

      const field: TFormField = {
        name: 'name' ,
        type: 'name' ,
      };

      FORM_FIELD_DEFINITIONS.name.validator = {
        tryCreate ,
      };

      validator.validateField(field ,'Jorge');

      expect(tryCreate).toHaveBeenCalledWith(
        'Jorge' ,
        {} ,
      );
    });

    it('does not apply presentation length settings to select fields' ,() => {
      const tryCreate = jest.fn().mockReturnValue({
        isOk: true ,
        isFailure: false ,
        instance: {} ,
      });
      const previousValidator = FORM_FIELD_DEFINITIONS.select.validator;

      FORM_FIELD_DEFINITIONS.select.validator = { tryCreate };

      try {
        const validator = new FormValidator();
        validator.validateField({
          name: 'category',
          type: 'select',
          validatorConfig: { customOption: 'kept' },
          presentation: { minLength: 2, maxLength: 10 },
        }, 'food');

        expect(tryCreate).toHaveBeenCalledWith('food', {
          customOption: 'kept',
        });
      } finally {
        FORM_FIELD_DEFINITIONS.select.validator = previousValidator;
      }
    });
  });

});
