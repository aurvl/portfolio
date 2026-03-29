import MdContentRenderer from "../ui/MarkdownRenderer";

type ProjectWindowSectionProps = {
    content: string
}

function ProjectWindowSection({ content }: ProjectWindowSectionProps) {
    return (
        <section className="project-win-sect w-full">
            <MdContentRenderer content={content} />
        </section>
    )
}

export default ProjectWindowSection