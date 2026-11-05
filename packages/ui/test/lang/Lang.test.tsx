import React from 'react';
import { render ,screen } from '@testing-library/react';

import { Lang } from '../../src';

const mockResolve = jest.fn();
const mockResolveChildren = jest.fn();

jest.mock('../../src/lang/resolver', () => ({
  useTranslationResolver: () => ({
    resolve: mockResolve,
    resolveChildren: mockResolveChildren,
  }),
}));

describe('Lang', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when langKey is provided', () => {
    it('should resolve the langKey using the children as defaultValue', () => {
      mockResolve.mockReturnValue('Salvar');

      render(
        <Lang langKey="actions.save">
          Save
        </Lang>,
      );

      expect(screen.getByText('Salvar')).toBeInTheDocument();

      expect(mockResolve).toHaveBeenCalledWith(
        'actions.save',
        {
          defaultValue: 'Save',
        },
      );

      expect(mockResolveChildren).not.toHaveBeenCalled();
    });

    it('should resolve the langKey using values and children as defaultValue', () => {
      mockResolve.mockReturnValue('Olá, Jorge!');

      render(
        <Lang
          langKey="welcome"
          values={{ name: 'Jorge' }}
        >
          {'Hello, {{name}}!'}
        </Lang>,
      );

      expect(screen.getByText('Olá, Jorge!')).toBeInTheDocument();

      expect(mockResolve).toHaveBeenCalledWith(
        'welcome',
        {
          name: 'Jorge',
          defaultValue: 'Hello, {{name}}!',
        },
      );

      expect(mockResolveChildren).not.toHaveBeenCalled();
    });

    it('should resolve the langKey without a defaultValue when children is not a string', () => {
      mockResolve.mockReturnValue('Salvar');

      render(
        <Lang langKey="actions.save">
          <span>Save</span>
        </Lang>,
      );

      expect(screen.getByText('Salvar')).toBeInTheDocument();

      expect(mockResolve).toHaveBeenCalledWith(
        'actions.save',
        {
          defaultValue: undefined,
        },
      );
    });

    it('should resolve the langKey without values when values is not provided', () => {
      mockResolve.mockReturnValue('Salvar');

      render(
        <Lang langKey="actions.save">
          Save
        </Lang>,
      );

      expect(mockResolve).toHaveBeenCalledTimes(1);

      expect(mockResolve).toHaveBeenCalledWith(
        'actions.save',
        {
          defaultValue: 'Save',
        },
      );
    });

    it('should resolve the langKey when children is null', () => {
      mockResolve.mockReturnValue('Salvar');

      render(
        <Lang langKey="actions.save">
          {null}
        </Lang>,
      );

      expect(screen.getByText('Salvar')).toBeInTheDocument();

      expect(mockResolve).toHaveBeenCalledWith(
        'actions.save',
        {
          defaultValue: undefined,
        },
      );
    });

    it('should resolve the langKey when children is undefined', () => {
      mockResolve.mockReturnValue('Salvar');

      render(<Lang langKey="actions.save" />);

      expect(screen.getByText('Salvar')).toBeInTheDocument();

      expect(mockResolve).toHaveBeenCalledWith(
        'actions.save',
        {
          defaultValue: undefined,
        },
      );
    });
  });

  describe('when langKey is not provided' ,() => {
    it('should resolve children using the translation resolver' ,() => {
      mockResolveChildren.mockReturnValue('Salvar');
      render(<Lang>actions.save</Lang>);
      expect(screen.getByText('Salvar')).toBeInTheDocument();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).
      toHaveBeenCalledWith('actions.save' ,undefined );
      expect(mockResolve).not.toHaveBeenCalled();
    });
    it('should resolve number children using the translation resolver' ,() => {
      mockResolveChildren.mockReturnValue(123);
      render(<Lang>{ 123 }</Lang>);
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(123 ,undefined );
      expect(mockResolve).not.toHaveBeenCalled();
    });
    it('should resolve null children using the translation resolver' ,() => {
      mockResolveChildren.mockReturnValue(null);
      const { container } = render(<Lang>{ null }</Lang> );
      expect(container).toBeEmptyDOMElement();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(null ,undefined );
      expect(mockResolve).not.toHaveBeenCalled();
    });
    it('should resolve element children using the translation resolver' ,() => {
      const child = (<span> Save </span>);
      mockResolveChildren.mockReturnValue(child);
      render(<Lang>{child}</Lang> );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(child ,undefined );
      expect(mockResolve).not.toHaveBeenCalled();
    });
  });
  describe('when depth is provided' ,() => {
    it('should pass the depth to resolveChildren' ,() => {
      mockResolveChildren.mockReturnValue(<div> translated:Save </div> );
      render(<Lang depth={ 1 }>
        <div> Save</div>
      </Lang> );
      expect(screen.getByText('translated:Save') ).toBeInTheDocument();
      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).
      toHaveBeenCalledWith(expect.objectContaining({ type: 'div'  }) ,1 );
    });
    it('should pass nested children and depth to resolveChildren' ,() => {
      const children = (<div><span> Save </span></div>);
      mockResolveChildren.mockReturnValue(<div><span> translated:Save </span>
      </div> );
      render(<Lang depth={ 2 }>{children}</Lang> );
      expect(screen.getByText('translated:Save') ).toBeInTheDocument();
      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(children ,2 );
    });
    it('should pass depth zero to resolveChildren' ,() => {
      const children = (<span> Save </span>);
      mockResolveChildren.mockReturnValue(children);
      render(<Lang depth={ 0 }>{children}</Lang> );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(children ,0 );
    });
    it('should pass negative depth to resolveChildren' ,() => {
      const children = (<span> Save </span>);
      mockResolveChildren.mockReturnValue(children);
      render(<Lang depth={ -1 }>{children}</Lang> );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(children ,-1 );
    });
    it('should preserve the result returned by resolveChildren' ,() => {
      const resolvedElement = (
        <div data-testid="content"> translated:Save </div>);
      mockResolveChildren.mockReturnValue(resolvedElement);
      render(<Lang depth={ 1 }>
        <div data-testid="content"> Save</div>
      </Lang> );
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('translated:Save');
      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
    });
  });

  describe('when depth is provided', () => {
    it('should resolve children according to the specified depth', () => {
      mockResolveChildren.mockReturnValue(
        <div>translated:Save</div>,
      );

      render(
        <Lang depth={1}>
          <div>Save</div>
        </Lang>,
      );

      expect(
        screen.getByText('translated:Save'),
      ).toBeInTheDocument();

      expect(mockResolve).not.toHaveBeenCalled();

      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'div',
        }),
        1,
      );
    });

    it('should resolve nested children according to the specified depth', () => {
      mockResolveChildren.mockReturnValue(
        <div>
          <span>translated:Save</span>
        </div>,
      );

      render(
        <Lang depth={2}>
          <div>
            <span>Save</span>
          </div>
        </Lang>,
      );

      expect(
        screen.getByText('translated:Save'),
      ).toBeInTheDocument();

      expect(mockResolve).not.toHaveBeenCalled();

      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'div',
        }),
        2,
      );
    });

    it('should not resolve children deeper than the specified depth', () => {
      mockResolveChildren.mockReturnValue(
        <div>
          <span>Save</span>
        </div>,
      );

      render(
        <Lang depth={1}>
          <div>
            <span>Save</span>
          </div>
        </Lang>,
      );

      expect(screen.getByText('Save')).toBeInTheDocument();

      expect(mockResolve).not.toHaveBeenCalled();

      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'div',
        }),
        1,
      );
    });

    it('should resolve multiple string children within the specified depth', () => {
      mockResolveChildren.mockReturnValue(
        <div>
          <span>translated:Save</span>
          <span>translated:Cancel</span>
        </div>,
      );

      render(
        <Lang depth={2}>
          <div>
            <span>Save</span>
            <span>Cancel</span>
          </div>
        </Lang>,
      );

      expect(
        screen.getByText('translated:Save'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('translated:Cancel'),
      ).toBeInTheDocument();

      expect(mockResolve).not.toHaveBeenCalled();

      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'div',
        }),
        2,
      );
    });

    it('should preserve non-string children', () => {
      mockResolveChildren.mockReturnValue(
        <div>
          {123}
          <span>translated:Save</span>
        </div>,
      );

      render(
        <Lang depth={2}>
          <div>
            {123}
            <span>Save</span>
          </div>
        </Lang>,
      );

      expect(screen.getByText('123')).toBeInTheDocument();

      expect(
        screen.getByText('translated:Save'),
      ).toBeInTheDocument();

      expect(mockResolve).not.toHaveBeenCalled();

      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
      expect(mockResolveChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'div',
        }),
        2,
      );
    });

    it('should preserve the element while resolving its children', () => {
      const resolvedElement = (
        <div data-testid="content">
          translated:Save
        </div>
      );

      mockResolveChildren.mockReturnValue(resolvedElement);

      render(
        <Lang depth={1}>
          <div data-testid="content">
            Save
          </div>
        </Lang>,
      );

      const content = screen.getByTestId('content');

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('translated:Save');

      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockResolveChildren).toHaveBeenCalledTimes(1);
    });
  });
});


