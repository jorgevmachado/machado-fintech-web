import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ColorInput from '../../src/components/color-input';

jest.mock('../../src/primitives', () => ({
  Text: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <span className={className}>{children}</span>
  ),
}));

describe('<ColorInput />', () => {
  it('allows displaying the label without uppercase styling', () => {
    render(<ColorInput name="color" label="Card color" uppercaseLabel={false} />);
    expect(screen.getByText('Card color')).not.toHaveClass('uppercase');
    expect(screen.getByLabelText('Select Color')).toHaveValue('#000000');
  });

  it.each([
    ['abc', '#aabbcc'],
    [' #AbC ', '#aabbcc'],
    ['12AbCd', '#12abcd'],
    ['#123456ff', '#123456'],
    ['', '#000000'],
    [undefined, '#000000'],
    ['invalid', '#000000'],
    ['#12', '#000000'],
  ])('normalizes %s for the picker without changing the text value', (value, expected) => {
    render(<ColorInput name="color" value={value} label="Color" />);
    expect(screen.getByLabelText('Select Color')).toHaveValue(expected);
    expect(screen.getByRole('textbox')).toHaveValue(value ?? '');
  });

  it('synchronizes both inputs when the controlled value changes', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { rerender } = render(<ColorInput ref={ref} name="color" value="#123456" />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    rerender(<ColorInput ref={ref} name="color" value="#abcdef" />);
    expect(ref.current).toHaveValue('#abcdef');
    expect(screen.getByLabelText('Select Color')).toHaveValue('#abcdef');
  });

  it.each(['textbox', 'picker'])('emits value, field name and input event from the %s', (source) => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();
    render(<ColorInput name="cardColor" value="#123456" onChange={onChange} onValueChange={onValueChange} />);
    const input = source === 'textbox' ? screen.getByRole('textbox') : screen.getByLabelText('Select Color');
    fireEvent.change(input, { target: { value: '#abcdef' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('#abcdef', 'cardColor', expect.objectContaining({
      target: input,
    }));
  });

  it('forwards blur events with value and field name', () => {
    const onBlur = jest.fn();
    const onValueBlur = jest.fn();
    render(<ColorInput name="color" value="#123456" onBlur={onBlur} onValueBlur={onValueBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onValueBlur).toHaveBeenCalledWith('#123456', 'color', expect.objectContaining({ target: input }));
  });

  it.each([{ disabled: true }, { readOnly: true }])('prevents picker editing when unavailable: %o', (props) => {
    render(<ColorInput name="color" value="#123456" {...props} />);
    expect(screen.getByLabelText('Select Color')).toBeDisabled();
    const input = screen.getByRole('textbox');
    if ('disabled' in props) expect(input).toBeDisabled();
    else expect(input).toHaveAttribute('readonly');
  });

  it('shows accessible errors instead of helper text, and switches to loading feedback', () => {
    const { rerender } = render(
      <ColorInput name="color" value="" isInvalid errorMessage="Invalid color" helperText="Choose a color" />,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid color');
    expect(screen.queryByText('Choose a color')).not.toBeInTheDocument();
    rerender(<ColorInput name="color" value="" helperText="Choose a color" isLoading loadingText="Loading colors" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Choose a color')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Loading colors');
  });
});
