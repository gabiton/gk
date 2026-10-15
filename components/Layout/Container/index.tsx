export const Container = ({ children, flex }: { children: React.ReactNode; flex?: boolean }) => {
    return (
        <div className={`container${flex ? ' flex' : ''}`}>
            {children}
        </div>
    );
};