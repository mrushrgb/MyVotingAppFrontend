import React from 'react';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    size = 'md',
    hover = true,
    shadow = true,
    borderRadius = 'md',
    className = '',
    onClick,
    style = {},
    ...props
}) => {
    const cardClasses = [
        'card-reusable',
        `card-${variant}`,
        `card-${size}`,
        `card-radius-${borderRadius}`,
        hover && 'card-hover',
        shadow && 'card-shadow',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};

// Card sub-components
const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`card-header ${className}`} {...props}>
        {children}
    </div>
);

const CardBody = ({ children, className = '', ...props }) => (
    <div className={`card-body ${className}`} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`card-footer ${className}`} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, level = 3, className = '', ...props }) => {
    const HeadingTag = `h${level}`;
    return (
        <HeadingTag className={`card-title ${className}`} {...props}>
            {children}
        </HeadingTag>
    );
};

const CardText = ({ children, className = '', ...props }) => (
    <p className={`card-text ${className}`} {...props}>
        {children}
    </p>
);

const CardIcon = ({ icon, color = 'primary', size = 'md', className = '', ...props }) => (
    <div className={`card-icon card-icon-${color} card-icon-${size} ${className}`} {...props}>
        <i className={icon}></i>
    </div>
);

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Text = CardText;
Card.Icon = CardIcon;

export default Card;
