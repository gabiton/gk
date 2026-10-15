export const Sidebar = ({ children }: { children: React.ReactNode;}) => {
    return (
        <div className={`sidebar`}>
            {children}
        </div>
    );
};