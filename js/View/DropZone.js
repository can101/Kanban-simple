import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
    static crateDropZone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
        <div class="kanban__dropzone"></div>
        `).children[0];

        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            dropZone.classList.add("kanban__dropzone--active");
        })

        dropZone.addEventListener("dragleave", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");
        })

        dropZone.addEventListener("drop", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");
            const columnElement = dropZone.closest(".kanban__column");
            const columnId = ~~columnElement.dataset.id;
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll('.kanban__dropzone'));
            const dropedIndex = dropZonesInColumn.indexOf(dropZone);
            const itemID = ~~e.dataTransfer.getData("text/plain")
            const droppedItemElemnt = document.querySelector(`[data-id="${itemID}"]`);
            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;
            if (droppedItemElemnt.contains(dropZone)) {
                return;
            }
            insertAfter.after(droppedItemElemnt)
            KanbanAPI.updateItem(itemID, {
                columnId,
                position: dropedIndex
            })
        })

        return dropZone
    }
}