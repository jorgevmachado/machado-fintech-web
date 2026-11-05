import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Navbar } from  '../../src';

jest.mock('@fintech/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/primitives', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon">
      {icon}
    </span>
  ),

  LanguageSwitcher: ({ variant }: { variant: string }) => (
    <div data-testid="language-switcher">
      {variant}
    </div>
  ),
}));


describe('Navbar', () => {

  const defaultProps = {
    variant: 'dark' as const,
    title: 'Dashboard',
    subtitle: 'Financial system',
    isAuthenticated: true,
    isSidebarCollapsed: false,
    onToggleSidebar: jest.fn(),
  };


  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should render title and subtitle', () => {
    render(
      <Navbar {...defaultProps} />
    );


    expect(
      screen.getByText('Dashboard')
    ).toBeInTheDocument();


    expect(
      screen.getByText('Financial system')
    ).toBeInTheDocument();
  });



  it('should render sidebar button when authenticated', () => {

    render(
      <Navbar {...defaultProps} />
    );


    expect(
      screen.getByRole('button')
    ).toBeInTheDocument();

  });



  it('should not render sidebar button when unauthenticated', () => {

    render(
      <Navbar
        {...defaultProps}
        isAuthenticated={false}
      />
    );


    expect(
      screen.queryByRole('button')
    ).not.toBeInTheDocument();

  });



  it('should call onToggleSidebar when sidebar button is clicked', () => {

    const onToggleSidebar = jest.fn();

    render(
      <Navbar
        {...defaultProps}
        onToggleSidebar={onToggleSidebar}
      />
    );


    fireEvent.click(
      screen.getByRole('button')
    );


    expect(
      onToggleSidebar
    ).toHaveBeenCalledTimes(1);

  });



  it('should render menu icon when sidebar is collapsed', () => {

    render(
      <Navbar
        {...defaultProps}
        isSidebarCollapsed={true}
      />
    );


    expect(
      screen.getByTestId('icon')
    ).toHaveTextContent('menu');

  });



  it('should render menu-open icon when sidebar is expanded', () => {

    render(
      <Navbar
        {...defaultProps}
        isSidebarCollapsed={false}
      />
    );


    expect(
      screen.getByTestId('icon')
    ).toHaveTextContent('menu-open');

  });



  it('should render custom icon', () => {

    render(
      <Navbar
        {...defaultProps}
        icon="attach-money"
      />
    );


    expect(
      screen.getAllByTestId('icon').length
    ).toBeGreaterThan(0);

  });



  it('should render LanguageSwitcher when enabled', () => {

    render(
      <Navbar
        {...defaultProps}
        withLanguageSwitch
      />
    );


    expect(
      screen.getByTestId('language-switcher')
    ).toBeInTheDocument();


  });

  it('should initialize ThemeSwitcher to match the navbar variant and request a variant change', () => {
    const onVariantChange = jest.fn();
    const { rerender } = render(
      <Navbar
        {...defaultProps}
        withThemeSwitcher
        onVariantChange={onVariantChange}
      />,
    );

    const lightOption = screen.getByRole('button', { name: 'Light theme' });
    const darkOption = screen.getByRole('button', { name: 'Dark theme' });

    expect(lightOption).toHaveAttribute('aria-pressed', 'false');
    expect(darkOption).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(lightOption);

    expect(onVariantChange).toHaveBeenCalledWith('light');
    expect(lightOption).toHaveAttribute('aria-pressed', 'false');
    expect(darkOption).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <Navbar
        {...defaultProps}
        variant="light"
        withThemeSwitcher
        onVariantChange={onVariantChange}
      />,
    );

    expect(lightOption).toHaveAttribute('aria-pressed', 'true');
    expect(darkOption).toHaveAttribute('aria-pressed', 'false');
  });

  it('should forward ThemeSwitcher changes through onVariantChange', () => {
    const onVariantChange = jest.fn();

    render(
      <Navbar
        {...defaultProps}
        withThemeSwitcher
        onVariantChange={onVariantChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Light theme' }));

    expect(onVariantChange).toHaveBeenCalledWith('light');
  });

  it('should render language and theme selectors side by side', () => {
    render(
      <Navbar
        {...defaultProps}
        withLanguageSwitch
        withThemeSwitcher
      />,
    );

    const languageSwitcher = screen.getByTestId('language-switcher');
    const themeGroup = screen.getByRole('group', { name: 'Theme' });

    expect(languageSwitcher.parentElement).toBe(themeGroup.parentElement);
    expect(languageSwitcher.parentElement).toHaveClass('flex', 'items-center', 'gap-2');
  });


  it('should not render LanguageSwitcher by default', () => {

    render(
      <Navbar {...defaultProps}/>
    );


    expect(
      screen.queryByTestId('language-switcher')
    ).not.toBeInTheDocument();

  });



  it('should apply secondary dark theme classes', () => {

    const { container } = render(
      <Navbar
        {...defaultProps}
        tone="secondary"
        variant="dark"
      />
    );


    expect(
      container.firstChild
    ).toHaveClass(
      'from-[#2e1065]'
    );

  });



  it('should apply neutral light theme classes', () => {
    const { container } = render(
      <Navbar
        {...defaultProps}
        tone="neutral"
        variant="light"
      />
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'from-[#ffffff]'
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'via-[#f8fafc]'
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'to-[#e2e8f0]'
    );
  });

});