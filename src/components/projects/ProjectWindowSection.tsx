import MdContentRenderer from "../ui/MarkdownRenderer";

type ProjectWindowSectionProps = {
    content: string
}

function ProjectWindowSection({ content }: ProjectWindowSectionProps) {
    return (
        <section className="project-win-sect min-w-0 w-full max-w-full">
            <MdContentRenderer content={content} />
        </section>
    )
}

export default ProjectWindowSection
