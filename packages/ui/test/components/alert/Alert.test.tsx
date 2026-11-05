import { render, screen } from '@testing-library/react';

import { Alert } from '../../../src';

describe('<Alert />', () => {
  it('renders message content', () => {
    render(<Alert variant="info" title="Info Message"/>);

    expect(screen.getByText('Info Message')).toBeInTheDocument();
    expect(screen.queryByTestId('alert-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-close')).not.toBeInTheDocument();
  });

  it('does not render message content when visible is false', () => {
    render(<Alert variant="info" title="Info Message" visible={false}/>);

    expect(screen.queryByText('Info Message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-close')).not.toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<Alert variant="info" title="Info Message" description="This is a description"/>);

    expect(screen.getByTestId('alert-description')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('should render button close when provided', () => {
    render(<Alert variant="info" title="Info Message" onClose={() => {}}/>);

    expect(screen.getByTestId('alert-close')).toBeInTheDocument();
  });

  it('should render alert error when provided', () => {
    render(<Alert variant="error" title="Error Message" />);
    expect(screen.getByText('Error Message')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon-error')).toBeInTheDocument();
  });
});